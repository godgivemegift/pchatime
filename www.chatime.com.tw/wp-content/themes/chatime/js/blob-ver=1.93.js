var $ = jQuery;
// ================= AltScrollable ======================
var AltScrollable = function (args) {
    var that = this;
    id = Math.floor(Math.random() * 10000000) + '';
    this.config = {};
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                window['altScrollable' + that.id] = window.setTimeout(callback, 1000 / 60);
            };
    })();
    window.cancelRequestAnimFrame = window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || function () {
            clearTimeout(window['altScrollable' + that.id]);
        };
    window.donothing = function () {
    };
    this.init = function (args) {
        this.config.thresholds = args.thresholds;
        this.config.longo = args.longo;
        this.config.inertia = args.inertia || 0;
        this.config.preventDefaultException = args.preventDefaultException;
        this.config.minSleepDifference = args.minSleepDifference || 0.00001;
        this.config.positionMultiplier = args.positionMultiplier || 1;
        this.continuos = args.continuos || [];
        this.onupdate = args.onupdate || window.donothing;
        this.$longo = $(args.longo);
        this.$window = $(window);
        this.prepare();
        if (this.config.touchable) {
            this.feel.iscroll.call(this);
        } else {
            this.feel.scroll.call(this);
        }
    };
    this.now = {
        prevpos: 0,
        spos: 0,
        _spos: 0,
        enabled: false,
        noresize: false,
    };
    this.prepare = function () {
        this.helpers.prepareContinuos.call(this);
    };
    this.continuos = [];
    this.go = function (that, s) {
        for (var i = 0, l = that.continuos.length; i < l; i++) {
            that.continuos[i].work.call(that, s, that.continuos[i], that.helpers.transform);
        }
    };
    this.feel = {
        scroll: function () {
            var that = this;
            that.update = function () {

                //@author shady
                that.now.spos = 0.2971247357;
                that.now._spos = 0.2971247357;

                // that.now.spos = 0.3271247357;
                // that.now._spos = 0.3271247357;

                that.now.spos += (that.now._spos - that.now.spos) * (1 - that.config.inertia);
                if (!that.now.frozen) {
                    that.go(that, that.now.spos);
                }

                that.onupdate(that.now.frozen);
                that.now.frozen = Math.abs(that.now.spos - that.now._spos) < that.config.minSleepDifference;
                that.process = window.requestAnimFrame(that.update);
            };
        }
    };
    this.enable = function () {
        if (!this.now.enabled) {
            this.now.enabled = true;
            this.update(true);
        }
    };
    this.init(args);
};
AltScrollable.prototype.helpers = {
    prepareContinuosWork: function (cont) {
        var units = cont.units;
        var threshold1 = cont.threshold1;
        var threshold2 = cont.threshold2;
        var updateParams = function (state, s, part, map, num) {
            for (var i = 0, l = units.length; i < l; i++) {
                var unit = units[i];
                var calculate = true;
                if (calculate) {
                    for (var j = 0, l2 = unit.params.length; j < l2; j++) {
                        var param = unit.params[j];
                        var val2, val3;
                        if (state === 1 || state === 2) {
                            if (typeof param.v === 'string') {
                                var v = parseFloat(param.v);
                                var dv = parseFloat(param.dv);
                                val2 = v + part * dv + '%';
                                val3 = v + dv + '%';
                            } else {
                                val2 = param.v + part * param.dv;
                                val3 = param.v + param.dv;
                            }
                        }
                        param.lastcv = param.cv;
                        param.cv = state === 0 ? param.v : state === 1 ? (map ? map[num] : val2) : (map ? map[map.length - 1] : val3);
                    }
                }
            }
        };
        var work = function (s, obj, transform) {
            var part = (s - threshold1) / (threshold2 - threshold1);
            var num = null;
            obj.prevState = obj.state;
            if (s <= threshold1) {
                obj.state = 0;
                updateParams(obj.state, s, part);
            } else if (s < threshold2) {
                obj.state = 1;
                updateParams(obj.state, s, part, obj.map, num);
                obj.silent = false;
            } else {
                obj.state = 2;
                updateParams(obj.state, s, part, obj.map);
            }
        };
        return work;
    },
    prepareContinuos: function () {
        this.multipleUnits = {};
        for (var i = 0; i < this.continuos.length; i++) {
            var cont = this.continuos[i];
            cont.state = 0;
            if (typeof cont.threshold1 !== 'number') {
                cont.threshold1 = this.config.thresholds[parseInt(cont.threshold1, 10)];
            }
            if (typeof cont.threshold2 !== 'number') {
                cont.threshold2 = this.config.thresholds[parseInt(cont.threshold2, 10)];
            }
            cont.work = this.helpers.prepareContinuosWork.call(this, cont);
        }
    }
};
// ================= AltScrollable ======================

// ===================== Blob ==========================
var yolkMetaballs = {
    num: 15,
    positions: [],
    sizes: [],
    metaballs: [],
    material: new THREE.ShaderMaterial({
        uniforms: {
            t: {
                type: 'f',
                value: 0
            },
            blurriness: {
                type: 'f',
                value: 0
            },
            resolution: {
                type: 'v2',
                value: null
            },
            positions: {
                type: 'v2v',
                value: []
            },
            sizes: {
                type: 'fv1',
                value: []
            },
            color: {
                type: 'c',
                value: null
            },
        },
        vertexShader: ['varying vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', '}'].join('\n'),
        fragmentShader: ['uniform float t;', 'uniform vec2 resolution;', 'uniform float blurriness;', 'uniform vec3 color;', 'uniform vec2 positions[15];', 'uniform float sizes[15];', 'varying vec2 vUv;', 'void main() {', 'vec2 p = vUv;', 'p.x *= resolution.x / resolution.y;', 'float c = 0.0;', 'float d = 0.0;', 'for (int i = 0; i < 15; i++) {', 'float d = .85 * distance(p, positions[i]) / sizes[i];', 'c += .035 * pow(d, -0.3);', '}', 'c = smoothstep(0.8, 0.8 + blurriness, c);', 'gl_FragColor = vec4(1);', 'gl_FragColor.rgb = mix(vec3(1), color, c);', '}'].join('\n')
    }),
    set: function (app, yolkSize, color, center) {
        yolkMetaballs.scale = app.config.renderTargetScale;
        yolkMetaballs.resolution = new THREE.Vector2(app.now.canvasWidth, app.now.canvasHeight).multiplyScalar(yolkMetaballs.scale);
        yolkMetaballs.yolkSize = yolkSize + 200;
        yolkMetaballs.color = color;
        yolkMetaballs.center = new THREE.Vector2(center.x, center.y);
    }
};
for (var i = 0; i < yolkMetaballs.num; i++) {
    yolkMetaballs.metaballs[i] = {
        angle: null
    };
}
noise.seed(Math.random());
var setUniforms = function (t, frame, app) {
    for (var i = 0; i < yolkMetaballs.num; i++) {
        yolkMetaballs.positions[i] = new THREE.Vector2(0, 0).copy(yolkMetaballs.metaballs[i].position).multiplyScalar(1 / app.$container.height());
        yolkMetaballs.sizes[i] = yolkMetaballs.metaballs[i].size;
    }
    yolkMetaballs.material.uniforms.t.value = t;
    yolkMetaballs.material.uniforms.positions.value = yolkMetaballs.positions;
    yolkMetaballs.material.uniforms.sizes.value = yolkMetaballs.sizes;
    yolkMetaballs.material.uniforms.color.value = yolkMetaballs.color;
    yolkMetaballs.material.uniforms.blurriness.value = 0.002 * Math.pow(1 - t, 3);
    yolkMetaballs.material.uniforms.resolution.value = new THREE.Vector2(app.$container.width(), app.$container.height());
}
yolkMetaballs.animateAppearance = function (t, frame, justCalculate, app) {
    var speed = 0.002;
    if (justCalculate) {
        var _t = t;
        t = 1;
    }
    for (var i = 0; i < yolkMetaballs.num; i++) {
        var met = yolkMetaballs.metaballs[i];
        var da = justCalculate ? (1 - _t * .5) * 5.4 : 5.4;
        met.angle = 2 * Math.PI / yolkMetaballs.num * i + noise.perlin2(i, (frame + 100) * speed) * da;
        if (i % 6) {
            var dist = 0;
        } else {
            var dist = yolkMetaballs.yolkSize * 0.22;
        }
        var dp = new THREE.Vector2(Math.cos(met.angle), Math.sin(met.angle)).multiplyScalar(dist);
        met.position = yolkMetaballs.center.clone().add(dp);
        met.dist = dist;
        met.size = t;
    }
    if (justCalculate) return;
    setUniforms(0, frame, app);
}
yolkMetaballs.animateDecay = function (t, frame, app) {
    yolkMetaballs.animateAppearance(t, frame, true, app);
    for (var i = 0; i < yolkMetaballs.num; i++) {
        var met = yolkMetaballs.metaballs[i];
        var ds = (1 - Math.pow(2.6 * t - 1, 2)) * 0.15;
        met.size += ds;
        var n = noise.perlin2(i * 0.8, frame * 0.004);
        met.dist += (yolkMetaballs.yolkSize * .6 + n * yolkMetaballs.yolkSize * 1.) * t;
        var dp = new THREE.Vector2(Math.cos(met.angle), Math.sin(met.angle)).multiplyScalar(met.dist);
        yolkMetaballs.metaballs[i].position = yolkMetaballs.center.clone().add(dp);
    }
    setUniforms(t, frame, app);
    yolkMetaballs.material.uniforms.color.value = yolkMetaballs.color.clone().lerp(new THREE.Color(0xffffff), 0);
}
// ===================== Blob ==========================

// ===================== Animations ====================
Animations = {};
Animations.setup = function (app) {
    (function () {
        var microDv = 0.000000001;
        var thresholds = {
            0: -microDv
        };
        var pushT = function (key, dv, prevKey) {
            prevKey = prevKey || key - 1;
            thresholds[key] = thresholds[prevKey] + dv;
        };
        pushT(1, 0.05);
        pushT(2, microDv);
        pushT(3, 0.05);
        pushT(4, microDv);
        pushT(5, 0.025);
        pushT(6, app.config.touch ? 0.07 : 0.05);
        pushT(7, 0.07);
        pushT(8, 0.05);
        pushT(9, microDv);
        pushT(10, 0.05);
        pushT(11, app.config.webgl ? 0.05 : 0.015);
        pushT(12, microDv);
        pushT(13, 0.01);
        pushT(14, 0.07);
        pushT('14_', 0.12, 14);
        pushT('_14', 0.05, '14_');
        pushT(15, 0.1, '_14');
        pushT(16, 0.07);
        pushT(17, 0.04);
        pushT(18, 0.055);
        pushT(19, microDv);
        pushT(20, 0.055);
        pushT(21, microDv);
        pushT(22, 0.055);
        pushT(23, microDv);
        pushT(24, app.config.touch ? 0.12 : 0.06);
        pushT(25, 0.01);
        var maxT = Number.MIN_VALUE;
        for (var key in thresholds) {
            if (thresholds.hasOwnProperty(key)) {
                maxT = thresholds[key] > maxT ? thresholds[key] : maxT;
            }
        }
        for (var key in thresholds) {
            if (thresholds.hasOwnProperty(key)) {
                thresholds[key] /= maxT;
            }
        }
        Animations.thresholds = thresholds;
    })();
    if (app.config.webgl) {
        if (app.$container) {
            var width = app.$container.width();
            var height = app.$container.height();
            app.renderer = new THREE.WebGLRenderer({
                alpha: false
            });
            app.renderer.setSize(width, height);
            app.renderer.setClearColor(0xffffff);
            var $canvas = $(app.renderer.domElement).attr('id', 'render_canvas_' + Math.floor(Math.random() * 10000000) + '');
            app.$container.append($canvas);
        }

        Animations.onResize = function () {
            var w = app.$container.width();
            var h = app.$container.height();
            var scale = app.config.canvasScale;
            app.renderer.setSize(w * scale, h * scale);
            app.now.canvasWidth = app.$container.width() * scale;
            app.now.canvasHeight = h * scale;
            $canvas.css({
                width: w + 'px',
                height: h + 'px'
            });
            app.renderer.clear(new THREE.Color(1, 1, 1));
        };
    }
    app.$slider = $('#slider');
    Animations.bottleAppearance1 = {
        type: 'continuos',
        threshold1: '0',
        threshold2: '1',
        use3d: true,
        silent: false,
        units: [{
            $el: $('#bottle'),
            params: [{
                name: 'y',
                v: 0,
                dv: 0
            }, {
                name: 'scaleX',
                v: 0,
                dv: 0
            }, {
                name: 'scaleY',
                v: 0,
                dv: 0
            }, {
                name: 'x',
                v: 0,
                dv: 0
            }]
        }, {
            $el: $('.logo-container-common'),
            params: [{
                name: 'y',
                v: 0,
                dv: 0
            }]
        }],
        onUpdate: function (anim, app) {
            if (anim.state == 1) {
                app.now.bottleScale = anim.units[0].params[1].cv;
                app.now.bottleSize = app.$container.height() * app.now.bottleScale * app.config.bottleAppearance.bottleOriginalScale;
                app.now.bottleY = anim.units[0].params[0].cv;
            }
        },
        onResize: function (e, anim, app) {
            if (app.now.mobile) {
                anim.units[1].params[0].dv = -180;
                if (anim.state > 1) {
                    anim.units[1].$el.css({
                        '-ms-transform': 'translateY(-180px)',
                        '-webkit-transform': 'translateY(-180px)',
                        'transform': 'translateY(-180px)'
                    });
                }
            } else {
                anim.units[1].params[0].dv = 0.01;
                if (anim.state > 1) {
                    anim.units[1].$el.css({
                        '-ms-transform': 'translateY(0)',
                        '-webkit-transform': 'translateY(0)',
                        'transform': 'translateY(0)'
                    });
                }
            }
            app.now.bottleStartScale = app.config.bottleAppearance.bottleStartScale * (app.now.mobile && app.now.landscape ? 1.2 : 1);
            app.now.bottleMainScale = app.config.bottleAppearance.bottleMainScale * (app.now.mobile && app.now.landscape ? 1.2 : 1);
            app.now.bottleStartSize = app.$container.height() * app.config.bottleAppearance.bottleOriginalScale * app.now.bottleStartScale;
            app.now.bottleMainSize = app.$container.height() * app.config.bottleAppearance.bottleOriginalScale * app.now.bottleMainScale;
            var h = app.$container.height() * app.config.bottleAppearance.bottleOriginalScale;
            anim.units[0].$el.css({
                height: h + 'px',
                width: h + 'px',
                'margin-left': -Math.round(h / 2) + 'px',
                'margin-bottom': -Math.round(h / 2) + 'px'
            });
            var shift = app.now.bottleStartSize * app.config.bottleAppearance.initialYShift;
            anim.units[0].params[0].v = shift;
            anim.units[0].params[0].dv = -shift - window.innerHeight * app.config.bottleAppearance.scalingFinishPosition;
            anim.units[0].params[1].v = app.now.bottleStartScale;
            anim.units[0].params[1].dv = -(app.now.bottleStartScale - app.now.bottleMainScale);
            anim.units[0].params[2].v = anim.units[0].params[1].v;
            anim.units[0].params[2].dv = anim.units[0].params[1].dv;
            anim.silent = (anim.state !== 1);
        }
    };
    Animations.yolkAppearance = {
        type: 'continuos',
        threshold1: '7',
        threshold2: '8',
        use3d: true,
        silent: true,
        units: [{
            hideSilent: true,
            bottomHideThreshold: '7',
            topHideThreshold: '12',
            $el: !app.config.webgl ? $('#yolk') : ($('#yolk').remove() && null),
            params: [{
                name: 'scaleX',
                v: 0,
                dv: 1
            }, {
                name: 'scaleY',
                v: 0,
                dv: 1
            }, {
                name: 'y',
                v: 0,
                dv: 0
            }, {
                name: 'opacity',
                v: 1,
                dv: 0
            }]
        }]
    };
    if (!app.config.webgl) {
        Animations.yolkDecay = {
            type: 'continuos',
            threshold1: '10',
            threshold2: '11',
            use3d: true,
            silent: true,
            units: [{
                $el: $('#yolk'),
                params: [{
                    name: 'scaleX',
                    v: 1,
                    dv: 0
                }, {
                    name: 'scaleY',
                    v: 1,
                    dv: 0
                }, {
                    name: 'y',
                    v: 0,
                    dv: 0
                }, {
                    name: 'opacity',
                    v: 1,
                    dv: -1
                }]
            }]
        };
    }
    app.config.webgl && (function () {
        Animations.yolkAppearance.units[0].hideSilent = false;
        Animations.yolkAppearance.units[0].params.splice(1, 2);
        Animations.yolkAppearance.threshold2 = '11';
        var yolkAppearanceFinishedPosition = (Animations.thresholds['8'] - Animations.thresholds['7']) * 1 / (Animations.thresholds['11'] - Animations.thresholds['7']);
        var scene = new THREE.Scene();
        var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
        camera.position.z = 5;
        var geometry = new THREE.PlaneBufferGeometry(1, 1);
        var plane = new THREE.Mesh(geometry, yolkMetaballs.material);
        scene.add(camera);
        scene.add(plane);
        var prevSilent;
        var frame = 0;
        Animations.yolkAppearance.tBurst = 0;
        Animations.yolkAppearance.onUpdate = function (anim, app) {
            if (anim.state === 1) {
                var t = anim.units[0].params[0].cv;
                if (t / yolkAppearanceFinishedPosition < 1) {
                    yolkMetaballs.animateAppearance(0.6 + t / yolkAppearanceFinishedPosition * 0.4, frame, app);
                } else {
                    t = (t - yolkAppearanceFinishedPosition) / (1 - yolkAppearanceFinishedPosition);
                    yolkMetaballs.animateDecay(t, frame, app);
                }
                app.renderer.render(scene, camera);
                frame++;
            } else if (anim.silent && !prevSilent) {
                app.renderer.clear(new THREE.Color(1, 1, 1));
            }
            prevSilent = anim.silent;
        };
        Animations.yolkAppearance.onUpdate.forced = true;
        Animations.yolkAppearance.onResize = function (e, anim, app) {
            // var w = window.innerWidth;
            // var h = window.innerHeight;
            var w = app.$container.width();
            var h = app.$container.height();
            camera.left = w / -2;
            camera.right = w / 2;
            camera.top = h / 2;
            camera.bottom = h / -2;
            plane.scale.x = w;
            plane.scale.y = h;
            camera.updateProjectionMatrix();
            yolkMetaballs.set(app, app.now.bottleMainSize * (app.now.mobile ? 0.8 : 1), new THREE.Color( app.config.yolkAppearance.yolkColor ), {
                x: w / 2 - 0.01 * h,
                y: h / 2 - 0.02 * h
            });
        };
    })();
};
// ===================== Animations ====================


// ===================== App =======================
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    };
}

window.webglAvailable = (function webglDetect() {
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;
        for (var i = 0; i < 4; i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    return true;
                }
            } catch (e) {
            }
        }
        return false;
    }
    return false;
})();

var blob = function () {
    this.$window = $(window);
    this.$body = $('body');
    this.$container = null;
    this.config = {
        preventWebGL: false,
        overlayTransition: 400,
        startTimeout: 50,
        bottleAppearance: {
            initialYShift: 0.18,
            bottleOriginalScale: 1.1972,
            bottleStartScale: 1.,
            bottleMainScale: 0.6097,
            scalingFinishPosition: .37
        },
        yolkAppearance: {
            yolkColor: '#ee3e96'
        },
        yolkTextAppearance: {
            initialXShift: 150,
            bottleWidth: 0.5,
            totalHeight: 100
        },
        isIphone: navigator.userAgent.indexOf('iPhone') != -1,
        mobileThreshold: 1024
    };
    this.now = {
        mobile: window.innerWidth < 1024
    };
    this.preloaders = [];

    var me = this;
    this.onUpdate = function (forcedOnly) {
        for (key in Animations) {
            if (!Animations.hasOwnProperty(key)) continue;
            var anim = Animations[key];
            if (!anim.onUpdate) continue;
            if (!forcedOnly || anim.onUpdate.forced) {
                anim.onUpdate(anim, me);
            }
        }
    };

    this.onResize = function (e) {
        me.now.mobile = false; //window.innerWidth < me.config.mobileThreshold;
        me.now.landscape = true; //window.innerWidth > window.innerHeight;
        Animations.onResize && Animations.onResize();
        for (key in Animations) {
            if (!Animations.hasOwnProperty(key)) continue;
            var anim = Animations[key];
            if (anim.onResize) {
                anim.onResize(e, anim, me);
            }
        }
    };

    this.setupAnimations = function () {
        Animations.setup(me);
        var continuos = [];
        var triggers = [];
        for (key in Animations) {
            if (!Animations.hasOwnProperty(key) || !Animations[key].type) continue;
            if (Animations[key].type === 'continuos') {
                continuos.push(Animations[key]);
            } else {
                triggers.push(Animations[key]);
            }
        }

        this.altScrollable = new AltScrollable({
            longo: me.config.scrollContainer,
            touchable: me.config.touch,
            preventDefaultException: {
                className: /(^|\s)touchable(\s|$)/
            },
            onupdate: me.onUpdate,
            thresholds: Animations.thresholds,
            continuos: continuos,
            inertia: me.config.touch ? 0 : 0.87,
            minSleepDifference: 0.000001,
            positionMultiplier: 1.055
        });
    };

    this.prepare = function () {
        me.now.lang = 'en';
        me.now.mobile = false; //window.innerWidth < me.config.mobileThreshold;
        if (window.webglAvailable && !me.config.preventWebGL) {
            me.config.webgl = true;
            me.config.canvasScale = !me.config.touch && window.devicePixelRatio || 1;
            if (me.config.canvasScale >= 2) {
                me.config.canvasScale = 1.5;
            }
            me.config.canvasScale = 1.5;
        }
    };

    this.bindHandlers = function () {
        me.$window.bind('resize', me.onResize);
        me.onResize();
    };

    this.init = function ($container) {
        me.$container = $container;
        me.prepare();
        me.setupAnimations();
        me.bindHandlers();
        me.altScrollable.enable();
    };
};

$(function () {
    $('.blob .blob__animation').each(function (index, elem) {
        var tmp = new blob();
        tmp.config.yolkAppearance.yolkColor = $(this).css( 'color' );
        tmp.init($(this));
    });
});
// ===================== App =======================