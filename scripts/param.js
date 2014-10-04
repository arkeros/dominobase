var EmulateShadowTree, GetParams, GetValue, SetElementValues, SetParamValues, svgns, xlinkns,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

svgns = "http://www.w3.org/2000/svg";

xlinkns = "http://www.w3.org/1999/xlink";

GetParams();

GetParams = function() {
  var href, name, param, paramArray, paramList, params, uids, valList, value, _i, _j, _len, _len1;
  uids = [];
  paramArray = [];
  if (document.defaultView.frameElement) {
    params = document.defaultView.frameElement.getElementsByTagName("param");
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      name = param.getAttribute("name");
      value = param.getAttribute("value");
      paramArray[name] = value;
    }
  }
  href = document.defaultView.location.href;
  if (__indexOf.call(href, "?") >= 0) {
    paramList = href.split("?")[1].split(/&|;/);
    for (_j = 0, _len1 = paramList.length; _j < _len1; _j++) {
      param = paramList[_j];
      valList = param.split("=");
      name = unescape(valList[0]);
      value = unescape(valList[1]);
      paramArray[name] = value;
    }
  }
  return SetElementValues(paramArray, uids);
};

GetValue = function(attrStr, params) {
  var defaultVal, paramName, paramSplit;
  paramSplit = attrStr.split(")");
  paramName = paramSplit[0].replace("param(", "");
  defaultVal = null;
  if (paramSplit[1]) {
    defaultVal = paramSplit[1].replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  }
  if (params[paramName]) {
    return params[paramName];
  } else {
    return defaultVal;
  }
};

SetElementValues = function(params, uids) {
  var el, elList, i, shadow, u, useEl, useEls, _i, _j, _len, _len1, _results;
  useEls = [];
  elList = document.documentElement.getElementsByTagName("*");
  for (i = _i = 0, _len = elList.length; _i < _len; i = ++_i) {
    el = elList[i];
    if ("use" !== el.localName) {
      SetParamValues(el, params);
    } else {
      shadow = EmulateShadowTree(el, params, uids, i);
      if (shadow) {
        useEls.push([el, shadow]);
      }
    }
  }
  _results = [];
  for (_j = 0, _len1 = useEls.length; _j < _len1; _j++) {
    u = useEls[_j];
    useEl = u[0];
    shadow = u[1];
    useEl.setAttribute("display", "none");
    if (useEl.nextSibling) {
      _results.push(useEl.parentNode.insertBefore(shadow, useEl.nextSibling));
    } else {
      _results.push(useEl.parentNode.appendChild(shadow));
    }
  }
  return _results;
};

SetParamValues = function(el, params, isShadow) {
  var attr, attrVal, attrns, newAttr, newVal, pair, pairSplit, paramAttrVal, paramSplit, _i, _len, _ref, _results;
  _ref = el.attributes;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    attr = _ref[_i];
    if (attr) {
      attrVal = attr.value;
      if (__indexOf.call(attrVal, "param(") >= 0) {
        if (attr.localName === "params") {
          if (isShadow) {
            paramSplit = attrVal.split(";");
            _results.push((function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = paramSplit.length; _j < _len1; _j++) {
                pair = paramSplit[_j];
                pairSplit = pair.split(":");
                newAttr = pairSplit[0];
                newVal = GetValue(pairSplit[1], params);
                attrns = null;
                if ("href" === newAttr || "xlink:href" === newAttr) {
                  attrns = xlinkns;
                }
                _results1.push(el.setAttributeNS(attrns, newAttr, newVal));
              }
              return _results1;
            })());
          } else {
            _results.push(void 0);
          }
        } else {
          newVal = GetValue(attrVal, params);
          if (newVal !== null && newVal !== "") {
            if (attr.localName === "content-value") {
              _results.push(el.replaceChild(document.createTextNode(newVal), el.firstChild));
            } else {
              el.setAttributeNS(attr.namespaceURI, attr.name, newVal);
              paramAttrVal = el.getAttribute("params");
              if (paramAttrVal) {
                _results.push(el.setAttribute("params", "" + paramAttrVal + ";" + attr.name + ":" + attrVal));
              } else {
                _results.push(el.setAttribute("params", "" + attr.name + ":" + attrVal));
              }
            }
          } else {
            _results.push(void 0);
          }
        }
      } else {
        _results.push(void 0);
      }
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

EmulateShadowTree = function(el, params, uids, idnum) {
  var attr, attrVal, child, hasParam, i, idref, name, newEl, pair, pairSplit, paramSplit, parametersAttrVal, refEl, shadow, shadowEl, shadowEls, shadowParams, uid, value, wrapper, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4;
  shadowParams = params;
  hasParam = false;
  _ref = el.childNodes;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    child = _ref[i];
    if (child.nodeType === 1 && eachChild.localName === "param") {
      name = child.getAttribute("name");
      value = child.getAttribute("value");
      shadowParams[name] = value;
      hasParam = true;
    }
  }
  parametersAttrVal = el.getAttribute("parameters");
  if (parametersAttrVal) {
    paramSplit = parametersAttrVal.split(";");
    for (i = _j = 0, _len1 = paramSplit.length; _j < _len1; i = ++_j) {
      pair = paramSplit[i];
      pairSplit = pair.split(":");
      shadowParams[pairSplit[0]] = pairSplit[1];
      hasParam = true;
    }
  }
  if (hasParam) {
    idref = el.getAttributeNS(xlinkns, "href").replace("#", "");
    refEl = document.getElementById(idref);
    newEl = refEl.cloneNode(true);
    SetParamValues(newEl, shadowParams, true);
    wrapper = document.createElementNS(svgns, "g");
    shadow = document.createElementNS(svgns, "g");
    _ref1 = el.attributes;
    for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
      attr = _ref1[_k];
      if ((_ref2 = attr.localName) !== "content-value" && _ref2 !== "params" && _ref2 !== "parameters" && _ref2 !== "href" && _ref2 !== "x" && _ref2 !== "y") {
        shadow.setAttribute(attr.name, attr.value);
      }
    }
    x = el.getAttribute("x");
    y = el.getAttribute("y");
    wrapper.setAttribute("transform", "translate(" + x + "," + y + ")");
    shadow.appendChild(newEl);
    wrapper.appendChild(shadow);
    shadowEls = newEl.getElementsByTagName("*");
    for (_l = 0, _len3 = shadowEls.length; _l < _len3; _l++) {
      shadowEl = shadowEls[_l];
      SetParamValues(shadowEl, shadowParams, true);
      _ref3 = shadowEl.attributes;
      for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {
        attr = _ref3[_m];
        attrVal = attr.value;
        if ("id" === attr.localName) {
          shadowEl.setAttribute(attr.name, "" + attrVal + "__" + idnum);
          uids[attrVal] = "" + attrVal + "__" + idnum;
        }
      }
      if (__indexOf.call(attrVal, "url(#") >= 0) {
        for (_n = 0, _len5 = uids.length; _n < _len5; _n++) {
          uid = uids[_n];
          if (_ref4 = "url(#" + uid + ")", __indexOf.call(attrVal, _ref4) < 0) {
            eachEl.setAttributeNS(attr.namespaceURI, attr.name, "url(#" + uids[uid] + ")");
          }
        }
      }
    }
    return wrapper;
  }
  return null;
};
