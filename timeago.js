/*
 * node-timeago
 * Cam Pedersen
 * <diffference@gmail.com>
 * Oct 6, 2011
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.10.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */

function timeago(timestamp) {
  if (timestamp instanceof Date) {
    return inWords(timestamp);
  } else if (typeof timestamp === "string") {
    return inWords(parse(timestamp));
  } else if (typeof timestamp === "number") {
    return inWords(new Date(timestamp))
  }
}

timeago.settings = {
  allowFuture: false,
  strings: {
    prefixAgo: null,
    prefixFromNow: null,
    suffixAgo: "ago",
    suffixFromNow: "from now",
    seconds: "less than a minute",
    minute: "about a minute",
    minutes: "%d minutes",
    hour: "about an hour",
    hours: "about %d hours",
    day: "a day",
    days: "%d days",
    month: "about a month",
    months: "%d months",
    year: "about a year",
    years: "%d years",
    numbers: []
  }
};

function inWordsHelper(distanceMillis) {
  var strings = timeago.settings.strings;
  var prefix = strings.prefixAgo;
  var suffix = strings.suffixAgo;
  if (timeago.settings.allowFuture) {
    if (distanceMillis < 0) {
      prefix = strings.prefixFromNow;
      suffix = strings.suffixFromNow;
    }
  }

  var seconds = Math.abs(distanceMillis) / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  var years = days / 365;

  function substitute(stringOrFunction, number) {
    var string = typeof stringOrFunction === 'function' ? stringOrFunction(number, distanceMillis) : stringOrFunction;
    var value = (strings.numbers && strings.numbers[number]) || number;
    return string.replace(/%d/i, value);
  }

  var words = seconds < 45 && substitute(strings.seconds, Math.round(seconds)) ||
    seconds < 90 && substitute(strings.minute, 1) ||
    minutes < 45 && substitute(strings.minutes, Math.round(minutes)) ||
    minutes < 90 && substitute(strings.hour, 1) ||
    hours < 24 && substitute(strings.hours, Math.round(hours)) ||
    hours < 48 && substitute(strings.day, 1) ||
    days < 30 && substitute(strings.days, Math.floor(days)) ||
    days < 60 && substitute(strings.month, 1) ||
    days < 365 && substitute(strings.months, Math.floor(days / 30)) ||
    years < 2 && substitute(strings.year, 1) ||
    substitute(strings.years, Math.floor(years));

  return [prefix, words, suffix].join(" ").toString().trim();
}

function parse(iso8601) {
  if (!iso8601) return;
  var s = iso8601.trim();
  s = s.replace(/\.\d\d\d+/, ""); // remove milliseconds
  s = s.replace(/-/, "/").replace(/-/, "/");
  s = s.replace(/T/, " ").replace(/Z/, " UTC");
  s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
  return new Date(s);
}

function inWords(date) {
  return inWordsHelper(distance(date));
}

function distance(date) {
  return (new Date().getTime() - date.getTime());
}

module.exports = timeago;