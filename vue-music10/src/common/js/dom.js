export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClassNames = className.split(' ');
  newClassNames.push(className);
  el.className = newClassNames.join(' ');
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

export function getAndSetAttributeData(el, attributName, val) {
  let newName = attributName;
  if (!val) {
    return el.getAttribute(newName);
  } else {
    return el.setAttribute(newName, val);
  }
}
