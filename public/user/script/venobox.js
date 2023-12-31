/*
 * VenoBox - jQuery Plugin
 * version: 1.8.1
 * @requires jQuery >= 1.7.0
 *
 * Examples at http://veno.es/venobox/
 * License: MIT License
 * License URI: https://github.com/nicolafranchini/VenoBox/blob/master/LICENSE
 * Copyright 2013-2017 Nicola Franchini - @nicolafranchini
 *
 */
!(function (e) {
  "use strict";
  var o,
    t,
    a,
    i,
    s,
    n,
    c,
    r,
    d,
    l,
    v,
    u,
    b,
    p,
    m,
    f,
    h,
    g,
    k,
    x,
    y,
    w,
    C,
    _,
    P,
    B,
    E,
    O,
    U,
    D,
    M,
    N,
    V,
    z,
    R,
    X,
    Y,
    j,
    W,
    $;
  e.fn.extend({
    venobox: function (q) {
      var I = this,
        A = {
          arrowsColor: "#B6B6B6",
          autoplay: !1,
          bgcolor: "#fff",
          border: "0",
          closeBackground: "#161617",
          closeColor: "#d2d2d2",
          framewidth: "",
          frameheight: "",
          infinigall: !1,
          htmlClose: "&times;",
          htmlNext: "<span>Next</span>",
          htmlPrev: "<span>Prev</span>",
          numeratio: !1,
          numerationBackground: "#161617",
          numerationColor: "#d2d2d2",
          numerationPosition: "top",
          overlayClose: !0,
          overlayColor: "rgba(23,23,23,0.85)",
          spinner: "double-bounce",
          spinColor: "#d2d2d2",
          titleattr: "title",
          titleBackground: "#161617",
          titleColor: "#d2d2d2",
          titlePosition: "top",
          cb_pre_open: function () {
            return !0;
          },
          cb_post_open: function () {},
          cb_pre_close: function () {
            return !0;
          },
          cb_post_close: function () {},
          cb_post_resize: function () {},
          cb_after_nav: function () {},
          cb_init: function () {},
        },
        H = e.extend(A, q);
      return (
        H.cb_init(I),
        this.each(function () {
          function q() {
            (y = O.data("gall")),
              (h = O.data("numeratio")),
              (b = O.data("infinigall")),
              (p = e('.vbox-item[data-gall="' + y + '"]')),
              (w = p.eq(p.index(O) + 1)),
              (C = p.eq(p.index(O) - 1)),
              p.length > 1
                ? ((U = p.index(O) + 1), a.html(U + " / " + p.length))
                : (U = 1),
              h === !0 ? a.show() : a.hide(),
              "" !== x ? i.show() : i.hide(),
              w.length || b === !0
                ? (e(".vbox-next").css("display", "block"), (_ = !0))
                : (e(".vbox-next").css("display", "none"), (_ = !1)),
              p.index(O) > 0 || b === !0
                ? (e(".vbox-prev").css("display", "block"), (P = !0))
                : (e(".vbox-prev").css("display", "none"), (P = !1)),
              (P === !0 || _ === !0) &&
                (r.on(ne.DOWN, T), r.on(ne.MOVE, Z), r.on(ne.UP, F));
          }
          function A(e) {
            return e.length < 1
              ? !1
              : m
              ? !1
              : ((m = !0),
                (g = e.data("overlay") || e.data("overlaycolor")),
                (v = e.data("framewidth")),
                (u = e.data("frameheight")),
                (s = e.data("border")),
                (t = e.data("bgcolor")),
                (d = e.data("href") || e.attr("href")),
                (o = e.data("autoplay")),
                (x = e.attr(e.data("titleattr")) || ""),
                e === C && r.addClass("animated").addClass("swipe-right"),
                e === w && r.addClass("animated").addClass("swipe-left"),
                void r.animate({ opacity: 0 }, 500, function () {
                  k.css("background", g),
                    r
                      .removeClass("animated")
                      .removeClass("swipe-left")
                      .removeClass("swipe-right")
                      .css({ "margin-left": 0, "margin-right": 0 }),
                    "iframe" == e.data("vbtype")
                      ? J()
                      : "inline" == e.data("vbtype")
                      ? oe()
                      : "ajax" == e.data("vbtype")
                      ? G()
                      : "video" == e.data("vbtype") ||
                        "vimeo" == e.data("vbtype") ||
                        "youtube" == e.data("vbtype")
                      ? K(o)
                      : (r.html('<img src="' + d + '">'), te()),
                    (O = e),
                    q(),
                    (m = !1),
                    H.cb_after_nav(O, U, w, C);
                }));
          }
          function Q(e) {
            27 === e.keyCode && S(),
              37 == e.keyCode && P === !0 && A(C),
              39 == e.keyCode && _ === !0 && A(w);
          }
          function S() {
            var o = H.cb_pre_close(O, U, w, C);
            return o === !1
              ? !1
              : (e("body").off("keydown", Q).removeClass("vbox-open"),
                O.focus(),
                void k.animate({ opacity: 0 }, 500, function () {
                  k.remove(), (m = !1), H.cb_post_close();
                }));
          }
          function T(e) {
            r.addClass("animated"),
              (V = R = e.pageY),
              (z = X = e.pageX),
              (D = !0);
          }
          function Z(e) {
            if (D === !0) {
              (X = e.pageX), (R = e.pageY), (j = X - z), (W = R - V);
              var o = Math.abs(j),
                t = Math.abs(W);
              o > t &&
                100 >= o &&
                (e.preventDefault(), r.css("margin-left", j));
            }
          }
          function F(e) {
            if (D === !0) {
              D = !1;
              var o = O,
                t = !1;
              (Y = X - z),
                0 > Y && _ === !0 && ((o = w), (t = !0)),
                Y > 0 && P === !0 && ((o = C), (t = !0)),
                Math.abs(Y) >= $ && t === !0
                  ? A(o)
                  : r.css({ "margin-left": 0, "margin-right": 0 });
            }
          }
          function G() {
            e.ajax({ url: d, cache: !1 })
              .done(function (e) {
                r.html('<div class="vbox-inline">' + e + "</div>"), te();
              })
              .fail(function () {
                r.html(
                  '<div class="vbox-inline"><p>Error retrieving contents, please retry</div>'
                ),
                  ae();
              });
          }
          function J() {
            r.html('<iframe class="venoframe" src="' + d + '"></iframe>'), ae();
          }
          function K(e) {
            var o,
              t = L(d),
              a = e ? "?rel=0&autoplay=1" : "?rel=0",
              i = a + ee(d);
            "vimeo" == t.type
              ? (o = "https://player.vimeo.com/video/")
              : "youtube" == t.type && (o = "https://www.youtube.com/embed/"),
              r.html(
                '<iframe class="venoframe vbvid" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0" src="' +
                  o +
                  t.id +
                  i +
                  '"></iframe>'
              ),
              ae();
          }
          function L(e) {
            if (
              (e.match(
                /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
              ),
              RegExp.$3.indexOf("youtu") > -1)
            )
              var o = "youtube";
            else if (RegExp.$3.indexOf("vimeo") > -1) var o = "vimeo";
            return { type: o, id: RegExp.$6 };
          }
          function ee(e) {
            var o = "",
              t = decodeURIComponent(e),
              a = t.split("?");
            if (void 0 !== a[1]) {
              var i,
                s,
                n = a[1].split("&");
              for (s = 0; s < n.length; s++)
                (i = n[s].split("=")), (o = o + "&" + i[0] + "=" + i[1]);
            }
            return encodeURI(o);
          }
          function oe() {
            r.html('<div class="vbox-inline">' + e(d).html() + "</div>"), ae();
          }
          function te() {
            (N = r.find("img")),
              N.length
                ? N.each(function () {
                    e(this).one("load", function () {
                      ae();
                    });
                  })
                : ae();
          }
          function ae() {
            i.html(x),
              r
                .find(">:first-child")
                .addClass("figlio")
                .css({ width: v, height: u, padding: s, background: t }),
              e("img.figlio").on("dragstart", function (e) {
                e.preventDefault();
              }),
              ie(),
              r.animate({ opacity: "1" }, "slow", function () {});
          }
          function ie() {
            var o = r.outerHeight(),
              t = e(window).height();
            (f = t > o + 60 ? (t - o) / 2 : "30px"),
              r.css("margin-top", f),
              r.css("margin-bottom", f),
              H.cb_post_resize();
          }
          if (((O = e(this)), O.data("venobox"))) return !0;
          (I.VBclose = function () {
            S();
          }),
            O.addClass("vbox-item"),
            O.data("framewidth", H.framewidth),
            O.data("frameheight", H.frameheight),
            O.data("border", H.border),
            O.data("bgcolor", H.bgcolor),
            O.data("numeratio", H.numeratio),
            O.data("infinigall", H.infinigall),
            O.data("overlaycolor", H.overlayColor),
            O.data("titleattr", H.titleattr),
            O.data("venobox", !0),
            O.on("click", function (b) {
              b.preventDefault(), (O = e(this));
              var p = H.cb_pre_open(O);
              if (p === !1) return !1;
              switch (
                ((I.VBnext = function () {
                  A(w);
                }),
                (I.VBprev = function () {
                  A(C);
                }),
                (g = O.data("overlay") || O.data("overlaycolor")),
                (v = O.data("framewidth")),
                (u = O.data("frameheight")),
                (o = O.data("autoplay") || H.autoplay),
                (s = O.data("border")),
                (t = O.data("bgcolor")),
                (_ = !1),
                (P = !1),
                (m = !1),
                (d = O.data("href") || O.attr("href")),
                (l = O.data("css") || ""),
                (x = O.attr(O.data("titleattr")) || ""),
                (B = '<div class="vbox-preloader">'),
                H.spinner)
              ) {
                case "rotating-plane":
                  B += '<div class="sk-rotating-plane"></div>';
                  break;
                case "double-bounce":
                  B +=
                    '<div class="sk-double-bounce"><div class="sk-child sk-double-bounce1"></div><div class="sk-child sk-double-bounce2"></div></div>';
                  break;
                case "wave":
                  B +=
                    '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>';
                  break;
                case "wandering-cubes":
                  B +=
                    '<div class="sk-wandering-cubes"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div></div>';
                  break;
                case "spinner-pulse":
                  B += '<div class="sk-spinner sk-spinner-pulse"></div>';
                  break;
                case "three-bounce":
                  B +=
                    '<div class="sk-three-bounce"><div class="sk-child sk-bounce1"></div><div class="sk-child sk-bounce2"></div><div class="sk-child sk-bounce3"></div></div>';
                  break;
                case "cube-grid":
                  B +=
                    '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>';
              }
              return (
                (B += "</div>"),
                (E =
                  '<a class="vbox-next">' +
                  H.htmlNext +
                  '</a><a class="vbox-prev">' +
                  H.htmlPrev +
                  "</a>"),
                (M =
                  '<div class="vbox-title"></div><div class="vbox-num">0/0</div><div class="vbox-close">' +
                  H.htmlClose +
                  "</div>"),
                (n =
                  '<div class="vbox-overlay ' +
                  l +
                  '" style="background:' +
                  g +
                  '">' +
                  B +
                  '<div class="vbox-container"><div class="vbox-content"></div></div>' +
                  M +
                  E +
                  "</div>"),
                e("body").append(n).addClass("vbox-open"),
                e(
                  ".vbox-preloader .sk-child, .vbox-preloader .sk-rotating-plane, .vbox-preloader .sk-rect, .vbox-preloader .sk-cube, .vbox-preloader .sk-spinner-pulse"
                ).css("background-color", H.spinColor),
                (k = e(".vbox-overlay")),
                (c = e(".vbox-container")),
                (r = e(".vbox-content")),
                (a = e(".vbox-num")),
                (i = e(".vbox-title")),
                i.css(H.titlePosition, "-1px"),
                i.css({
                  color: H.titleColor,
                  "background-color": H.titleBackground,
                }),
                e(".vbox-close").css({
                  color: H.closeColor,
                  "background-color": H.closeBackground,
                }),
                e(".vbox-num").css(H.numerationPosition, "-1px"),
                e(".vbox-num").css({
                  color: H.numerationColor,
                  "background-color": H.numerationBackground,
                }),
                e(".vbox-next span, .vbox-prev span").css({
                  "border-top-color": H.arrowsColor,
                  "border-right-color": H.arrowsColor,
                }),
                r.html(""),
                r.css("opacity", "0"),
                k.css("opacity", "0"),
                q(),
                k.animate({ opacity: 1 }, 250, function () {
                  "iframe" == O.data("vbtype")
                    ? J()
                    : "inline" == O.data("vbtype")
                    ? oe()
                    : "ajax" == O.data("vbtype")
                    ? G()
                    : "video" == O.data("vbtype") ||
                      "vimeo" == O.data("vbtype") ||
                      "youtube" == O.data("vbtype")
                    ? K(o)
                    : (r.html('<img src="' + d + '">'), te()),
                    H.cb_post_open(O, U, w, C);
                }),
                e("body").keydown(Q),
                e(".vbox-prev").on("click", function () {
                  A(C);
                }),
                e(".vbox-next").on("click", function () {
                  A(w);
                }),
                !1
              );
            });
          var se = ".vbox-overlay";
          H.overlayClose || (se = ".vbox-close"),
            e(document).on("click", se, function (o) {
              (e(o.target).is(".vbox-overlay") ||
                e(o.target).is(".vbox-content") ||
                e(o.target).is(".vbox-close") ||
                e(o.target).is(".vbox-preloader")) &&
                S();
            }),
            (z = 0),
            (X = 0),
            (Y = 0),
            ($ = 50),
            (D = !1);
          var ne = {
              DOWN: "touchmousedown",
              UP: "touchmouseup",
              MOVE: "touchmousemove",
            },
            ce = function (o) {
              var t;
              switch (o.type) {
                case "mousedown":
                  t = ne.DOWN;
                  break;
                case "mouseup":
                  t = ne.UP;
                  break;
                case "mouseout":
                  t = ne.UP;
                  break;
                case "mousemove":
                  t = ne.MOVE;
                  break;
                default:
                  return;
              }
              var a = de(t, o, o.pageX, o.pageY);
              e(o.target).trigger(a);
            },
            re = function (o) {
              var t;
              switch (o.type) {
                case "touchstart":
                  t = ne.DOWN;
                  break;
                case "touchend":
                  t = ne.UP;
                  break;
                case "touchmove":
                  t = ne.MOVE;
                  break;
                default:
                  return;
              }
              var a,
                i = o.originalEvent.touches[0];
              (a =
                t == ne.UP ? de(t, o, null, null) : de(t, o, i.pageX, i.pageY)),
                e(o.target).trigger(a);
            },
            de = function (o, t, a, i) {
              return e.Event(o, { pageX: a, pageY: i, originalEvent: t });
            };
          "ontouchstart" in window
            ? (e(document).on("touchstart", re),
              e(document).on("touchmove", re),
              e(document).on("touchend", re))
            : (e(document).on("mousedown", ce),
              e(document).on("mouseup", ce),
              e(document).on("mouseout", ce),
              e(document).on("mousemove", ce)),
            e(window).resize(function () {
              e(".vbox-content").length && setTimeout(ie(), 800);
            });
        })
      );
    },
  });
})(jQuery);
