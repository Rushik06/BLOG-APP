import type { Schema, Struct } from '@strapi/strapi';

export interface RepeatableHowItWorksSteps extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_how_it_works_steps';
  info: {
    displayName: 'howItWorksSteps';
  };
  attributes: {
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'repeatable.how-it-works-steps': RepeatableHowItWorksSteps;
    }
  }
}
