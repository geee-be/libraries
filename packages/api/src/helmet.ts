import helmet from 'helmet';

export type HelmetOptions = Required<Parameters<typeof helmet>>[0];

export const DEFAULT_HELMET_OPTIONS: HelmetOptions = {};

// cspell: ignore frameguard hpkp

export const API_HELMET_OPTIONS: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      objectSrc: ["'none'"],
      styleSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  dnsPrefetchControl: { allow: false },
  // expectCt?: boolean | IHelmetExpectCtConfiguration;
  // featurePolicy: IFeaturePolicyOptions,
  // frameguard: true,
  // hidePoweredBy: true,
  // hpkp: false,
  // ieNoOpen: true,
  // noCache: true,
  // noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: false,
};
