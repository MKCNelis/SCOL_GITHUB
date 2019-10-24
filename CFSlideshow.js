var CFSlideshow = function(id, options) {
    "use strict";
    this.id = id;
    this.presetValues = {
        width: '500px',
        height: '300px',
        autoplay: false,
        delay: 10,
        transition: 'fade',
        showThumbs: true,
        thumbMode: 'preview',
        showButtons: true,
        buttonHide: true,
        clickCancel: true
    };
    this.options = {
        width: options.width,
        height: options.height,
        autoplay: options.autoplay,
        delay: options.delay,
        transition: options.transition,
        showThumbs: options.showThumbs,
        thumbMode: options.thumbMode,
        showButtons: options.showButtons,
        buttonHide: options.buttonHide,
        clickCancel: options.clickCancel
    };
    for (var opt in this.options) {
        if (this.options[opt] === undefined) {
            this.options[opt] = this.presetValues[opt];
        }
    }
    this.elem = null;
    this.slides = 0;
    this.currentSlide = 0;
    this.bugString = '';
    this.init();
};
CFSlideshow.prototype.init = function() {
    "use strict";
    var that = this;
    this.elem = document.getElementById(this.id);
    this.slides = this.getLevelElements(this.elem, 'section').length;
    try {
        this.elem.style.width = this.options.width;
        this.elem.style.height = this.options.height;
    } catch (e) {
        this.elem.style.setProperty('width', this.options.width);
        this.elem.style.setProperty('height', this.options.height);
        this.bugString += 'err: alternate style property. ' + e + '.<br />'
    }
    if (this.options.showButtons) {
        var buttonNext = document.createElement('div');
        buttonNext.className = "nextBtn";
        try {
            this.elem.append(buttonNext);
        } catch (e) {
            this.elem.appendChild(buttonNext);
        }
        var buttonBack = document.createElement('div');
        buttonBack.className = "backBtn";
        try {
            this.elem.prepend(buttonBack);
        } catch (e) {
            this.elem.appendChild(buttonBack);
        }
        var fslide = null;
        var nextButton = null;
        var prevButton = null;
        try {
            fslide = this.getLevelElements(this.elem, 'section')[0];
            nextButton = this.elem.getElementsByClassName('nextBtn')[0];
            prevButton = this.elem.getElementsByClassName('backBtn')[0];
        } catch (e) {
            fslide = this.getByClass(this.elem, 'slide')[0];
            nextButton = this.getByClass(this.elem, 'nextBtn')[0];
            prevButton = this.getByClass(this.elem, 'backBtn')[0];
            this.bugString += 'err: getElementsByClassName not available. ' + e + '.<br />';
        }
        fslide.className += ' active';
        this.addListener('click', nextButton, function() {    
            if (that.currentSlide < that.slides-1) {
                that.currentSlide++;
                that.changeSlide(that.currentSlide, 'right');
                if (that.options.showThumbs) {
                    that.changeThumb(that.elem, that.currentSlide);
                }
                if (that.options.clickCancel) {
                    if (that.options.autoplay) {
                        clearInterval(autotimer);
                    }
                }
            }
        });
        this.addListener('click', prevButton, function() {
            if (that.currentSlide > 0) {
                that.currentSlide--;
                that.changeSlide(that.currentSlide, 'left');
                if (that.options.showThumbs) {
                    that.changeThumb(that.elem, that.currentSlide);
                }
                if (that.options.clickCancel) {
                    if (that.options.autoplay) {
                        clearInterval(autotimer);
                    }
                }
            }
        });
        prevButton.className = 'backBtn disabled';
        if (this.options.buttonHide) {
            nextButton.style.opacity = 0;
            nextButton.style.pointerEvents = 'none';
            prevButton.style.opacity = 0;
            prevButton.style.pointerEvents = 'none';
            this.addListener('mouseover', this.elem, function() {
                try {
                    nextButton.style.opacity = 1;
                    nextButton.style.pointerEvents = 'all';
                    prevButton.style.opacity = 1;
                    prevButton.style.pointerEvents = 'all';
                } catch (e) {
                    nextButton.style.setProperty('opacity', 1);
                    nextButton.style.setProperty('pointer-events', 'all');
                    prevButton.style.setProperty('opacity', 1);
                    prevButton.style.setProperty('pointer-events', 'all');
                    that.bugString += 'err: using alternate style properties. ' + e + '.<br />';
                }
            });
            this.addListener('mouseout', this.elem, function() {
                try {
                    nextButton.style.opacity = 0;
                    nextButton.style.pointerEvents = 'none';
                    prevButton.style.opacity = 0;
                    prevButton.style.pointerEvents = 'none';
                } catch (e) {
                    nextButton.style.setProperty('opacity', 0);
                    nextButton.style.setProperty('pointer-events', 'none');
                    prevButton.style.setProperty('opacity', 0);
                    prevButton.style.setProperty('pointer-events', 'none');
                    that.bugString += 'err: alternate style properties. ' + e + '.<br />';
                }
            });
        }
    }
    if (this.options.showThumbs) {
        var tcontainer = document.createElement('div');
        tcontainer.className = 'thumbnails';
        try {
            this.elem.append(tcontainer);
        } catch (e) {
            this.elem.appendChild(tcontainer);
        }
        for (var i = 0; i < this.slides; i++) {
            var thumb = document.createElement('span');
            thumb.className = 'thumb';
            try {
                tcontainer.append(thumb);
            } catch (e) {
                tcontainer.appendChild(thumb);
            }
            if (this.options.thumbMode === 'preview') {
                var slideContent = this.getLevelElements(this.elem, 'section')[i];
                var thumbContent = document.createElement('div');
                thumbContent.className = 'thumb-preview';
                try {
                    thumb.append(thumbContent);
                } catch (e) {
                    thumb.appendChild(thumbContent);
                }
                thumbContent.innerHTML = slideContent.innerHTML;
            }
        }
        var thumbs = null;
        try {
            thumbs = this.elem.getElementsByClassName('thumb');
        } catch (e) {
            thumbs = this.getByClass(this.elem, 'thumb');
        }
        thumbs[0].className += ' active';
        var direction = '';
        for (var t = 0; t < thumbs.length; t++) {
            var tt = thumbs[t];
            tt.id = t;
            that.addListener('click', tt, function(event) {
                var cs = parseFloat(event.target.id);
                if (cs > that.currentSlide) {
                    direction = 'right';
                } else if (cs < that.currentSlide) {
                    direction = 'left';
                }
                that.currentSlide = cs;
                that.changeSlide(cs, direction);
                for (var i = 0; i < thumbs.length; i++) {
                    thumbs[i].className = 'thumb';
                }
                this.className = 'thumb active';
            });
        }
    }
    if (this.options.autoplay) {
        var autotimer = setInterval(function() {
            if (that.currentSlide < that.slides - 1) {
                that.currentSlide++;
            } else {
                that.currentSlide = 0;
            }
            that.changeSlide(that.currentSlide);
            if (this.options.showThumbs) {
                that.changeThumb(that.elem, that.currentSlide);
            }
        }, that.options.delay * 1000);
    }
    if (this.options.transition === 'fade') {
        for (var j = 0; j < this.slides; j++) {
            var tslide = this.getLevelElements(this.elem, 'section')[j];
            tslide.style.opacity = 0;
            tslide.style.transition = 'opacity 1s ease-out';
            try {
                tslide.style.setProperty('-webkit-transition', 'opacity 1s ease-out');
            } catch (e) {
                this.bugString += 'err: transition property error. ' + e + '.<br />';
            }
        }
        var openSlide = this.getLevelElements(this.elem, 'section')[0];
        openSlide.style.opacity = 1;
    } else if (this.options.transition === 'slide') {
        for (var k = 0; k < this.slides; k++) {
            var uslide = this.getLevelElements(this.elem, 'section')[k];
            uslide.style.transition = 'left 1s ease-out';
            try {
                uslide.style.setProperty('-webkit-transition', 'left 1s ease-out');
            } catch (e) {
                this.bugString += 'err: transition property error. ' + e + '.<br />';
            }
        }
        var gslide = this.getLevelElements(this.elem, 'section')[0];
        var nslide = this.getLevelElements(this.elem, 'section')[1];
        var lslide = this.getLevelElements(this.elem, 'section')[this.slides-1];
        gslide.style.left = '0px';
        nslide.style.left = this.width;
        lslide.style.left = '-' + this.width;
    }
};
CFSlideshow.prototype.changeSlide = function(slideNum, dir) {
    "use strict";
    var allslides = this.getLevelElements(this.elem, 'section');
    var tslide = allslides[slideNum];
    var pslide = 0;
    var direction = dir;
    for (var i = 0; i < allslides.length; i++) {
        if (allslides[i].className.indexOf('active') > -1) {
            pslide = i;
        }
    }
    this.transitionSlide(this.elem, tslide, pslide, direction);
    if (this.options.showButtons) {
        var nb = this.elem.getElementsByClassName('nextBtn')[0];
        var pb = this.elem.getElementsByClassName('backBtn')[0];
        nb.className = 'nextBtn';
        pb.className = 'backBtn';
        if (slideNum === 0) {
            pb.className += ' disabled';
        } else if (slideNum === this.slides - 1) {
            nb.className += ' disabled';
        }
    }
};
CFSlideshow.prototype.nextSlide = function() {
    "use strict";
    var that = this;
    if (this.currentSlide < this.slides) {
        this.currentSlide++;
        that.changeSlide(this.currentSlide);
    }
};
CFSlideshow.prototype.prevSlide = function() {
    "use strict";
    var that = this;
    if (this.currentSlide > 0) {
        this.currentSlide--;
        that.changeSlide(this.currentSlide);
    }
};
CFSlideshow.prototype.getByClass = function(obj, className) {
    var elems = [];
    var all = obj.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
        if (all[i].className.indexOf(className) > 0) {
            elems.push(all[i]);
        }
    }
    return elems;
};
CFSlideshow.prototype.addListener = function(type, target, handler) {
    "use strict";
    if (target.addEventListener) {
        target.addEventListener(type, handler, false);
    } else if (target.attachEvent) {
        type = 'on' + type;
        target.attachEvent(type, handler);
    } else {
        target['on' + type] = handler;
    }
}
CFSlideshow.prototype.changeThumb = function(el, n) {
    var thumbs = null;
    try {
        thumbs = el.getElementsByClassName('thumb');
    } catch (e) {
        thumbs = this.getByClass(el, 'thumb');
    }
    for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].className = 'thumb';
    }
    thumbs[n].className = 'thumb active';
}
CFSlideshow.prototype.getLevelElements = function(el, tag) {
    "use strict";
    var arr = el.getElementsByTagName(tag);
    var items = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].parentNode === el) {
            items.push(arr[i]);
        }
    }
    return items;
};
CFSlideshow.prototype.transitionSlide = function (elem, slide, prevSlide, dir) {
    "use strict";
    var tslide = this.getLevelElements(elem, 'section')[prevSlide];
    var allSlides = this.getLevelElements(this.elem, 'section');
    var nslide = this.getLevelElements(elem, 'section')[this.currentSlide + 1];
    if (this.options.transition === 'fade') {
        slide.style.opacity = 0;
        tslide.style.opacity = 0;
        slide.style.opacity = 1;
    } else if (this.options.transition === 'slide') {
        if (dir === 'right') {
            tslide.style.zIndex = 1;
            tslide.style.left = '-' + this.width;
            slide.style.left = '0px';
            if (nslide) {
                 nslide.style.left = this.width;
            }
        } else {
            tslide.style.zIndex = 1;
            tslide.style.left = this.width;
            slide.style.left = '0px';
        }
    }
    for (var i = 0; i < allSlides.length; i++) {
        allSlides[i].className = '';
    }
    slide.className = 'active';
};
CFSlideshow.prototype.getCurrentSlide = function() {
    "use strict";
    return this.currentSlide;
};
CFSlideshow.prototype.getTotalSlides = function() {
    "use strict";
    return this.slides;
};