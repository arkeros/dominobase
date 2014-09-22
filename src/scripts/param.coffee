svgns = "http://www.w3.org/2000/svg"
xlinkns = "http://www.w3.org/1999/xlink"

GetParams()

GetParams = () ->
  uids = []
  paramArray = []

  if document.defaultView.frameElement
     params = document.defaultView.frameElement.getElementsByTagName "param"
     for param in params
        name = param.getAttribute "name"
        value = param.getAttribute "value"
        paramArray[name] = value

  href = document.defaultView.location.href
  if "?" in href
    paramList = href.split("?")[1].split(/&|;/)
    for param in paramList
       valList = param.split "="
       name = unescape valList[0]
       value = unescape valList[1]
       paramArray[name] = value

  SetElementValues paramArray, uids


GetValue = (attrStr, params) ->
    # parse attribute value for parameter reference and fallback value
    paramSplit = attrStr.split ")"
    paramName = paramSplit[0].replace "param(", ""
    defaultVal = null
    if paramSplit[1]
        defaultVal = paramSplit[1].replace(/^\s\s*/, "").replace /\s\s*$/, ""

    if params[paramName] then params[paramName] else defaultVal


SetElementValues = (params, uids) ->
    useEls = []
    elList = document.documentElement.getElementsByTagName "*"

    for el, i in elList
        if "use" isnt el.localName
            SetParamValues el, params
        else
            shadow = EmulateShadowTree el, params, uids, i
            if shadow
                useEls.push [el, shadow]

    for u in useEls
        useEl = u[0]
        shadow = u[1]
        useEl.setAttribute "display", "none"
        if useEl.nextSibling
            useEl.parentNode.insertBefore shadow, useEl.nextSibling
        else
            useEl.parentNode.appendChild shadow


SetParamValues = (el, params, isShadow) ->
    for attr in el.attributes
        if attr
            attrVal = attr.value;

            if "param(" in attrVal
                #alert("attr: " + attr.localName + "\nvalue: " + attrVal)
                if attr.localName is "params"
                    #alert("attr.name: " + attr.name + "\nattrVal: " + attrVal + "\nisShadow: " + isShadow)
                    if isShadow
                        #alert(attrVal)
                        paramSplit = attrVal.split ";"
                        for pair in paramSplit
                            #alert("eachPair: " + eachPair)
                            pairSplit = pair.split ":"
                            newAttr = pairSplit[0]

                            newVal = GetValue pairSplit[1], params

                            attrns = null
                            if "href" is newAttr or "xlink:href" is newAttr
                                attrns = xlinkns
                            el.setAttributeNS attrns, newAttr, newVal
                else
                    newVal = GetValue attrVal, params
                    if newVal not in [null, ""]
                        if attr.localName is "content-value"
                            el.replaceChild document.createTextNode(newVal), el.firstChild
                        else
                            el.setAttributeNS attr.namespaceURI, attr.name, newVal
                            #alert("attr.name: " + attr.name + "\nattrVal: " + newVal)

                            # note replacement values in params metadata attribute
                            paramAttrVal = el.getAttribute "params"
                            if paramAttrVal
                                el.setAttribute "params", "#{paramAttrVal};#{attr.name}:#{attrVal}"
                                #alert(paramAttrVal)
                            else
                                el.setAttribute "params", "#{attr.name}:#{attrVal}"

#au37k
#emulate modifying shadow tree by duplicating element are replacing over use element
EmulateShadowTree = (el, params, uids, idnum) ->
    #alert("EmulateShadowTree")
    shadowParams = params
    hasParam = false

    for child, i in el.childNodes
        #alert(eachChild + ": " + eachChild.nodeType)
        if child.nodeType == 1 and eachChild.localName is "param"
            name = child.getAttribute "name"
            value = child.getAttribute "value"
            shadowParams[name] = value
            hasParam = true
            # alert("name: " + name + "\nvalue: " + val)

    parametersAttrVal = el.getAttribute "parameters"
    if parametersAttrVal
        #alert(parametersAttrVal)
        paramSplit = parametersAttrVal.split ";"
        for pair, i in paramSplit
            #alert("eachPair: " + eachPair)
            pairSplit = pair.split ":"
            shadowParams[pairSplit[0]] = pairSplit[1]
            hasParam = true

    if hasParam
        #alert("hasParam")
        idref = el.getAttributeNS(xlinkns, "href").replace "#", ""
        refEl = document.getElementById idref

        #emulate modifying shadow tree by duplicating element are replacing over use element
        newEl = refEl.cloneNode true

        # alert("EmulateShadowTree:\n\nnewEl:" + newEl + "\nshadowParams: " + shadowParams )
        SetParamValues newEl, shadowParams, true

        wrapper = document.createElementNS svgns, "g"
        shadow = document.createElementNS svgns, "g"
        for attr in el.attributes
            if attr.localName not in ["content-value", "params", "parameters", "href", "x", "y"]
                #copy use element attributes to replacement image
                shadow.setAttribute attr.name, attr.value

        x = el.getAttribute "x"
        y = el.getAttribute "y"
        wrapper.setAttribute "transform", "translate(#{x},#{y})"

        shadow.appendChild newEl
        wrapper.appendChild shadow

        shadowEls = newEl.getElementsByTagName "*"

        for shadowEl in shadowEls
            SetParamValues shadowEl, shadowParams, true
            for attr in shadowEl.attributes
                attrVal = attr.value
                #alert("attr: " + attr.localName + "\nvalue: " + attrVal)
                if "id" is attr.localName
                    #change id to unique id
                    shadowEl.setAttribute attr.name, "#{attrVal}__#{idnum}"
                    uids[attrVal] = "#{attrVal}__#{idnum}"

            #alert( attrVal )
            if "url(#" in attrVal
              #alert( attrVal )
              for uid in uids
                #alert( uid + ": " + uids[uid] )
                if "url(#" + uid + ")" not in attrVal
                  eachEl.setAttributeNS( attr.namespaceURI, attr.name, "url(#" + uids[uid] + ")" );

        return wrapper
    return null
