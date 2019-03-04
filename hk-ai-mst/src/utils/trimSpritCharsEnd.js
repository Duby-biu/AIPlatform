import fp from 'lodash/fp';

export const trimSpritCharsEnd = (url) => {
  return fp.trimCharsEnd('/', url);
};

export const trimUrlSpritCharsEndInProps = (props) => {
  return trimSpritCharsEnd(fp.get('match.url', props));
};

export const trimPathSpritCharsEndInProps = (props) => {
  return trimSpritCharsEnd(fp.get('match.path', props));
};