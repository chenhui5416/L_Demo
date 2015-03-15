window.fullPage = function(ele, opt) {
// 全局变量

  var _global = {
    'sectionSelector': 'section',
    'offset': 0,
    'sectionColor': ['#000000'],
    'horizontal': false,
    'scrollEnd': true,
    'aniTime': 500,
    'debug': 0
  }

  var touchStartX = 0
  var touchStartY = 0
  var touchEndX = 0
  var touchEndY = 0

  extend(_global, opt)
  init()

  function init() {
    var sections = document.getElementsByClassName(_global.sectionSelector)
    _global.sectionsNum = sections.length

    sections = Array.prototype.slice.call(sections)

    if (!_global.horizontal) {

      sections.forEach(function(a, b) {
        var colorId = b % _global.sectionColor.length  // 循环定义颜色

        addClass(a, '__section')
        setStyle(a, 'background-color', _global.sectionColor[colorId])
      })
    } else {
      setStyle(ele, 'width', _global.sectionsNum*100 + '%')

      sections.forEach(function(a, b) {
      var colorId = b % _global.sectionColor.length  // 循环定义颜色

        addClass(a, '__section')
        addClass(a, 'h_section')
        setStyle(a, 'background-color', _global.sectionColor[colorId])
      })
    }


    var activeSection = document.getElementsByClassName('__section active')
    if (!activeSection.length) {
      addClass(sections[0], 'active')
    }

// todo 需要兼容浏览器
    addMouseWheelHandler()
    window.addEventListener('resize', resizeHandler)
    window.addEventListener('touchstart', touchStartHandler)

  }

  function touchStartHandler(e) {
    touchStartX = e.touches[0].screenX
    touchStartY = e.touches[0].screenY

    document.addEventListener('touchmove', touchMoveHandler, false)
  }


  function touchMoveHandler(e) {
    touchEndY = e.touches[0].screenY
    touchEndX = e.touches[0].screenX
    var v_dir = touchEndY - touchStartY
    var h_dir = touchEndX - touchStartX
    var dir = _global.horizontal ? h_dir : v_dir
    // var offset = _global.offset

    if (touchEndY != 0 || touchEndX != 0) {
      if (dir > 5) {
        _global.offset = sectionMove(false, _global.offset, _global.horizontal)
      } else if (dir < -5) {
        _global.offset = sectionMove(true, _global.offset, _global.horizontal)
      }
    }
    touchEndY = 0
    touchEndX = 0
    touchStartX = 0
    touchStartY = 0
    document.removeEventListener('touchmove', touchMoveHandler)
  }

  function addMouseWheelHandler() {
    // firefox don't support mousewhell
    // ie 11 support mousewheel wheel both, so need some handler to solve it
    window.addEventListener('mousewheel', wheelHandler, false)
    window.addEventListener('wheel', wheelHandler, false)
  }

  function wheelHandler(e) {
    // deltaY for firefox
    var value = e.wheelDelta || -e.deltaY

    if (value < 0) {
      _global.offset = sectionMove(true, _global.offset, _global.horizontal)
    } else {
      _global.offset = sectionMove(false, _global.offset, _global.horizontal)
    }
  }

  function resizeHandler() {
    var activeSection = document.getElementsByClassName('__section active')[0]
    var index = getNodeIndex(activeSection)
    var offset = _global.horizontal ? activeSection.offsetWidth : activeSection.offsetHeight

    _global.offset = (offset * index)
    silentScroll(_global.offset, _global.horizontal)

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

  function sectionMove(dir, offset, horizontal) {
    // dir == true 向下 向右，false 向上 向左
    var activeSection = document.getElementsByClassName('__section active')[0]
    var sectionOffset = horizontal ? activeSection.offsetWidth : activeSection.offsetHeight
    if(!_global.scrollEnd) {
      return offset
    }

    if (dir) {
        if (offset < sectionOffset * (_global.sectionsNum- 1)) {
          var next = realNextSibling(activeSection)

          silentScroll(offset += sectionOffset, horizontal)
          removeClass(activeSection, 'active')
          addClass(next, 'active')
        }
    } else {
      if (offset > 0) {
        var prev = realPrevSibling(activeSection)

        silentScroll(offset -= sectionOffset, horizontal)
        removeClass(activeSection, 'active')
        addClass(prev, 'active')
      } else {
        offset = 0
      }

    }
    return offset
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

  function silentScroll(value, horizontal) {
    horizontal = horizontal || false
    var translate3d = horizontal ? 'translate3d(-' + value +'px, 0px, 0px)' : 'translate3d(0px, -' + value + 'px, 0px)'

    transformContainer(translate3d, false)
    _global.scrollEnd = false
    setTimeout(afterScrollEnd, _global.aniTime)
  }

  function afterScrollEnd() {
    _global.scrollEnd = true
  }

  function transformContainer(translate3d, animated) {
    var transition = 'all ' + _global.aniTime + 'ms ' + 'ease';

    setStyle(ele, '-webkit-transition', transition);
    setStyle(ele, 'transition', transition);
    setStyle(ele, '-webkit-transform', translate3d);
    setStyle(ele, '-moz-transform', translate3d);
    setStyle(ele, '-ms-transform', translate3d);
    setStyle(ele, 'transform', translate3d);
  }

// class 操作
  function hasClass(ele, className) {
    return !! ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }

  function addClass(ele, className) {
    if (ele && !hasClass(ele, className)) {
      ele.className += ' ' + className
    }
  }

  function removeClass(ele, className) {
    if (ele && hasClass(ele, className)) {
      ele.className = ele.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'),'')
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
