function createVideo(){

    var name = $('#webcam-name').val();
	var image_url = $('#image-url').val();
    var address = $('#address').val();
    var darkness = $('#ignore-darkness').is(':checked');
    $.ajax({
        url: '/api/videos',
        type: 'POST',
        data: {name:name,image_url: image_url,address:address,ignoreDarkness:darkness},
    })
    .done(response)
    .fail(response);
}

function response(e){
    console.log(e);
}


$(function(){

    $('.create-video').on('click',createVideo);

});