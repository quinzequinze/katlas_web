var iframe = document.querySelector('iframe');
var player = new Vimeo.Player(iframe);
var videoWidth = 0;
var videoHeight = 0;
var videoRatio = 0;

$(document).ready(function() {
    $(window).resize(function() {
        
        player.getVideoWidth().then(function(width) {
            videoWidth = width;
        }).catch(function(error) {
            console.log("video not ready")
        });

        player.getVideoHeight().then(function(height) {
            videoHeight = height;
            if (videoWidth != 0) {
                var videoRatio = videoHeight/videoWidth;

                var videoHeight = $("#showReel").width()*videoRatio;
                $("#video").height(videoHeight);
            } 
        }).catch(function(error) {
            console.log("video not ready")
        });
  
    }).resize();
});


function videoInAnnimation () {
    hideThreeJsOnVideoIn();
    $("#centralButton").css( {display: "none"} )
    $("#about").css( {display: "none"} )
    $("#contact").css( {display: "none"} )
    $("#video").css( {width: "0%",height: "80%", display: "flex", "z-index": "9999"} );
    $("#video").hide();
    $("#video").show(2500);
    $("#video").animate({width: "80%"},{easing:"swing", duration: 2300, complete:playVideo});
    player.on('timeupdate', onVideoUpdate);

}

function videoOutAnnimation () {
    $("#video").animate({height: "0%"},{easing:"swing", duration: 2300, complete:unHideThreeJsOnVideoOut});
}

function playVideo () {
    player.play()
    player.setCurrentTime(190); 
}

function stopVideo () {
    player.stop()
}

function onVideoUpdate (e) {
    if (e.percent > 0.90) {
        player.off('timeupdate', onVideoUpdate);
        videoOutAnnimation(); 
        stopVideo();
    }
}

