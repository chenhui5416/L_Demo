window.fullPage = function(ele, opt) {
// 全局变量

  var _global = {
    'sectionSelector': 'section',
    'top': 0,
    'sectionColor': ['#000000']
  }

  extend(_global, opt)
  init()

  function init() {
    var _sections = document.getElementsByClassName(_global.sectionSelector)

    _sections = Array.prototype.slice.call(_sections)
    _sections.forEach(function(a, b) {
      var colorId = b % _global.sectionColor.length  // 循环定义颜色

      addClass(a, '__section')
      setStyle(a, 'background-color', _global.sectionColor[colorId])
    })
    _global._sectionsNum = _sections.length

    var activeSection = document.getElementsByClassName('__section active')
    if (!activeSection.length) {
      addClass(_sections[0], 'active')
    }

// todo 需要兼容浏览器
    window.addEventListener('mousewheel', wheelHandler)
    window.addEventListener('resize', resizeHandler)

  }

  function wheelHandler(e) {
    var value = e.wheelDelta

    if (value < 0) {
      sectionMove(true)
    } else {
      sectionMove(false)
    }
  }

  function resizeHandler() {
    var activeSection = document.getElementsByClassName('__section active')[0]
    var index = getNodeIndex(activeSection)
    var sectionHeight = activeSection.offsetHeight

    _global.top = (sectionHeight * index)
    silentScroll(_global.top)

  }


  function getNodeIndex(node) {
    var index = 0

    while (node = node.previousSibling) {
      if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
        index ++
      }
    }

    return index
  }

  function sectionMove(dir) {
    // dir == true 向下，false 向上
    var activeSection = document.getElementsByClassName('__section active')[0]
    var sectionHeight = activeSection.offsetHeight


    if (dir) {
      if (_global.top < sectionHeight * (_global._sectionsNum-1)){
        var next = realNextSibling(activeSection)

        silentScroll(_global.top += sectionHeight)
        removeClass(activeSection, 'active')
        addClass(next, 'active')
      }
    } else {
      if (_global.top > 0) {
        var prev = realPrevSibling(activeSection)

        silentScroll(_global.top -= sectionHeight)
        removeClass(activeSection, 'active')
        addClass(prev, 'active')
      } else {
        _global.top = 0
      }
    }
  }

  function realNextSibling(ele) {
    var next = ele.nextSibling

    while (next && next.nodeType != 1) {
      next = next.nextSibling
    }

    return next
  }

  function realPrevSibling(ele) {
    var prev = ele.previousSibling

    while (prev && prev.nodeType != 1) {
      prev = prev.previousSibling
    }

    return prev
  }

  function silentScroll(top) {
    var translate3d = 'translate3d(0px, -' + top + 'px, 0px)'
    transformContainer(translate3d, false)
  }

  function transformContainer(translate3d, animated) {
    var transition = 'all ' + 500 + 'ms ' + 'ease';

    setStyle(ele, '-webkit-transition', transition);
    setStyle(ele, 'transition', transition);
    setStyle(ele, '-webkit-transform', translate3d);
    setStyle(ele, '-moz-transform', translate3d);
    setStyle(ele, '-ms-transform', translate3d);
    setStyle(ele, 'transform', translate3d);
  }

// class 操作
  function hasClass(ele, className) {
    return !!ele.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))
  }

  function addClass(ele, className) {
    if (ele && !hasClass(ele, className)) {
      ele.className += ' ' + className
    }
  }

  function removeClass(ele, className) {
    if (ele && hasClass(ele, className)) {
      ele.className=ele.className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'')
    }
  }

  function setStyle(ele, style, value) {
    ele.style[style] = value;
  }

  function extend(target, source) {
    if (typeof(source) !== 'object') {
      source = {}
    }

    for (var key in source) {
      target[key] = source[key]
    }

    return target
  }
}
