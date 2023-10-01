import { JSX } from 'preact';

declare module '@emotion/styled' {
  export type StyledTags = {
    [Tag in keyof JSX.IntrinsicElements]: (
      props:
        | {
            as?: any;
          }
        | JSX.IntrinsicElements[Tag],
    ) => JSX.Element;
  };

  export interface CreateStyled extends BaseCreateStyled, StyledTags {}

  declare const styled: CreateStyled;
  export default styled;
}
