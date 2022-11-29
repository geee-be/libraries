// eslint-disable-next-line @typescript-eslint/ban-types
export const get = (belowFn?: Function): NodeJS.CallSite[] => {
  const oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;

  const dummyObject: { stack: NodeJS.CallSite[] } = { stack: [] };

  const v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = (dummyObject, v8StackTrace) => {
    return v8StackTrace;
  };
  Error.captureStackTrace(dummyObject, belowFn || get);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const v8StackTrace = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;
  Error.stackTraceLimit = oldLimit;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return v8StackTrace;
};

export const parse = (err: Error): CallSite[] => {
  if (!err.stack) {
    return [];
  }

  const lines = err.stack.split('\n').slice(1);
  return lines
    .map((line) => {
      if (line.match(/^\s*[-]{4,}$/)) {
        return createParsedCallSite({
          fileName: line,
          lineNumber: null,
          functionName: null,
          typeName: null,
          methodName: null,
          columnNumber: null,
          'native': null,
        });
      }

      const lineMatch = line.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
      if (!lineMatch) {
        return;
      }

      let object: string | null = null;
      let method: string | null = null;
      let functionName: string | null = lineMatch[1];
      let typeName: string | null = null;
      let methodName: string | null = null;
      const isNative = (lineMatch[5] === 'native');

      if (functionName) {
        let methodStart = functionName.lastIndexOf('.');
        if (functionName[methodStart - 1] === '.') { methodStart--; }
        if (methodStart > 0) {
          const o = object = functionName.substr(0, methodStart);
          method = functionName.substr(methodStart + 1);
          const objectEnd = o.indexOf('.Module');
          if (objectEnd > 0) {
            functionName = functionName.substr(objectEnd + 1);
            object = o.substr(0, objectEnd);
          }
        }
      }

      if (method) {
        typeName = object;
        methodName = method;
      }

      if (method === '<anonymous>') {
        methodName = null;
        functionName = null;
      }

      const properties = {
        fileName: lineMatch[2] || null,
        lineNumber: parseInt(lineMatch[3], 10) || null,
        functionName,
        typeName,
        methodName,
        columnNumber: parseInt(lineMatch[4], 10) || null,
        'native': isNative,
      };

      return createParsedCallSite(properties);
    })
    .filter((callSite) => {
      return !!callSite;
    });
};

class CallSite {
  constructor(properties: Record<string, unknown>) {
    Object.keys(properties).forEach((property) => {
      this[property] = properties[property];
    });
  }
}

const strProperties = [
  'this',
  'typeName',
  'functionName',
  'methodName',
  'fileName',
  'lineNumber',
  'columnNumber',
  'function',
  'evalOrigin',
];

const boolProperties = [
  'topLevel',
  'eval',
  'native',
  'constructor',
];

strProperties.forEach(function (property) {
  CallSite.prototype[property] = null;
  CallSite.prototype['get' + property[0].toUpperCase() + property.substr(1)] = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this[property];
  };
});

boolProperties.forEach(function (property) {
  CallSite.prototype[property] = false;
  CallSite.prototype['is' + property[0].toUpperCase() + property.substr(1)] = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this[property];
  };
});

const createParsedCallSite = (properties: Record<string, unknown>): CallSite => {
  return new CallSite(properties);
};
