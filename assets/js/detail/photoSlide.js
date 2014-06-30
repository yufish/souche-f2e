/**
 * Created by Administrator on 2014/6/18.
 */

define(function()
{
    var photoSlideControler = {};

    var init = function(config)
    {
        var lastPhoto = 0;
        var photos = $(".photosWrap li");
        var photoInfo = $(".photoInfo");
        var photoSmall = $(".photosSmallWrap li");
        var length = photoSmall.length;
        var timer = null;

        var bigImages = null;
        var iframe = null;
        var index = 0;
        var appendIframe = function(index) {
            if (bigImages) {
                iframe.Slider.setCurrent(index);
                bigImages.css("display", "block");
            } else {
                bigImages = $("<iframe name='bigImages' id='bigImages' allowtransparency='true' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
                bigImages.attr("src", config.api_bigImg);
                bigImages.css({
                    display: "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    background: "#000",
                    width: "100%",
                    height: $(document.body).height(),
                    zIndex: 1000000000000
                })
                $(document.body).append(bigImages);
                iframe = window.frames['bigImages'];
                $(iframe).load(function() {
                    iframe.Slider.init({  //slider 是什么？？
                        viewHeight: $(window).height()
                    });
                    iframe.Slider.setCurrent(index);
                    bigImages.css("display", "block");
                })
            }
        }
        $("#onsale_detail .photosWrap").click(function(event) {
            var target = event.target;
            if (target.nodeName == "IMG") {
                index = $(target).parent().index();
                appendIframe(index);
            }
        });
        $("#onsale_detail .showBig").click(function() {
            appendIframe(0);
        });

        photoInfo.text("1/" + length + " " + photos.eq(0).find("img").attr("alt"));
        photoSmall.eq(0).find("span").show();

        var photoSlide = function(targetPhoto) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                if (targetPhoto == lastPhoto) {
                    return false;
                }

                var lastP = photos.eq(lastPhoto);
                var targetP = photos.eq(targetPhoto);
                var lastSmallP = photoSmall.eq(lastPhoto);
                var targetSmallP = photoSmall.eq(targetPhoto);
                var imgSrc = targetP.attr("imgSrc");
                var img = targetP.find("img");
                if (img.attr("src") == "") {
                    targetP.find("img").attr("src", imgSrc);
                }

                targetSmallP.find("span").show();
                lastSmallP.find("span").hide();
                lastP.addClass("photoLastActive");
                targetP.css("opacity", "0").addClass("photoActive").animate({
                    "opacity": "1"
                }, 300, function() {
                    lastP.removeClass();
                });

                if (targetPhoto == 11) {
                    smallSlide($(".photoSmallPre"));
                }
                if (targetPhoto == 12) {
                    smallSlide($(".photoSmallNext"));
                }
                lastPhoto = targetPhoto;

                var text = targetP.find("img").attr("alt");
                photoInfo.text(targetPhoto + 1 + "/" + length + " " + text);

            }, 150);
        };
        photoSmall.mouseenter(function() {
            $this = $(this);
            var index = $this.index();
            if ($this.parent().is(".photosSmall2")) {
                index += 12;
            }
            photoSlide(index);
        });

        $(".photoPre").click(function() {
            if (lastPhoto != 0) {
                photoSlide(lastPhoto - 1);
            }
        });
        $(".photoNext").click(function() {
            if (lastPhoto != length - 1) {
                photoSlide(lastPhoto + 1);
            }
        });
        var wrapWidth = $(".wrap").width();
        if (wrapWidth == 1200) {
            smallSlideWidth = "-546px";
        } else {
            smallSlideWidth = "-504px";
        }
        var smallSlide = function(current) {
            var left = "0px";
            if (current.is($(".photoSmallNext"))) {
                left = smallSlideWidth;
                current.addClass("photoActiveNext");
                $(".photoSmallPre").removeClass("photoActivePre");
            } else {
                current.addClass("photoActivePre");
                $(".photoSmallNext").removeClass("photoActiveNext");
            }
            $(".photosSmallWrap div").animate({
                "margin-left": left
            }, 300);
        };
        $(".photoSmallNext").click(function() {
            smallSlide($(this));
        });
        $(".photoSmallPre").click(function() {
            smallSlide($(this));
        });
    }

    photoSlideControler.init = init ;
    return photoSlideControler;
});