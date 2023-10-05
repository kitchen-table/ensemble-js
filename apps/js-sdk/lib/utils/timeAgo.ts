import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const timeAgoFormatter = new TimeAgo('en-US');

export function timeAgo(date: Date) {
  return timeAgoFormatter.format(date);
}
