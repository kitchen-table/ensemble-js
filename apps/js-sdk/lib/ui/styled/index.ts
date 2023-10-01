import { default as _styled, type Interpolation } from '@emotion/styled';
import type { ComponentClass, JSX, ComponentType, ComponentProps } from 'preact';
import type { CreateStyled as BaseCreateStyled } from '@emotion/styled/base';
import type { PropsOf, Theme } from '@emotion/react/dist/emotion-react.cjs';
import type { ComponentSelector } from '@emotion/css';
import type { FC, Ref } from 'preact/compat';

/**
 * @desc
 * Overwrite the type definition of `styled` from `@emotion/styled` to support Preact.
 */
interface StyledComponent<
  _ComponentProps extends {},
  SpecificComponentProps extends {} = {},
  JSXProps extends {} = {},
> extends FC<_ComponentProps & SpecificComponentProps & JSXProps>,
    ComponentSelector {
  withComponent<C extends ComponentClass<ComponentProps<C>>>(
    component: C,
  ): StyledComponent<_ComponentProps & PropsOf<C>, {}, { ref?: Ref<InstanceType<C>> }>;
  withComponent<C extends ComponentType<ComponentProps<C>>>(
    component: C,
  ): StyledComponent<_ComponentProps & PropsOf<C>>;
  withComponent<Tag extends keyof JSX.IntrinsicElements>(
    tag: Tag,
  ): StyledComponent<_ComponentProps, JSX.IntrinsicElements[Tag]>;
}

interface CreateStyledComponent<
  ComponentProps extends {},
  SpecificComponentProps extends {} = {},
  JSXProps extends {} = {},
> {
  /**
   * @typeparam AdditionalProps  Additional props to add to your styled component
   */
  <AdditionalProps extends {} = {}>(
    ...styles: Array<
      Interpolation<ComponentProps & SpecificComponentProps & AdditionalProps & { theme: Theme }>
    >
  ): StyledComponent<ComponentProps & AdditionalProps, SpecificComponentProps, JSXProps>;

  (
    template: TemplateStringsArray,
    ...styles: Array<Interpolation<ComponentProps & SpecificComponentProps & { theme: Theme }>>
  ): StyledComponent<ComponentProps, SpecificComponentProps, JSXProps>;

  /**
   * @typeparam AdditionalProps  Additional props to add to your styled component
   */
  <AdditionalProps extends {}>(
    template: TemplateStringsArray,
    ...styles: Array<
      Interpolation<ComponentProps & SpecificComponentProps & AdditionalProps & { theme: Theme }>
    >
  ): StyledComponent<ComponentProps & AdditionalProps, SpecificComponentProps, JSXProps>;
}

type StyledTags = {
  [Tag in keyof JSX.IntrinsicElements]: CreateStyledComponent<
    {
      theme?: Theme;
      as?: any;
    },
    JSX.IntrinsicElements[Tag]
  >;
};

interface CreateStyled extends BaseCreateStyled, StyledTags {}

const styled = _styled as unknown as CreateStyled;

export default styled;
