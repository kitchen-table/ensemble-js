import { getCssSelector } from 'css-selector-generator';

export function elementFinder(element: Element) {
  const selector = getCssSelector(element, {
    selectors: ['id', 'tag', 'nthoftype', 'nthchild'],
    combineWithinSelector: false,
    combineBetweenSelectors: false,
  });
  return selector;
}
