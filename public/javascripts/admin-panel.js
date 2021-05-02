$(document).ready(function () {
    let bloggerInfo = [];

    $('#bloggers tr').on('click', function () {
        const bloggerRow = this;
        const bloggerData = $(bloggerRow).children();

        bloggerInfo = extractBloggerData(bloggerData);


        $('#avatar').attr('src', bloggerInfo[0]);
        $('#username').text(bloggerInfo[1]);
        $('#firstname').text(bloggerInfo[2]);
        $('#lastname').text(bloggerInfo[3]);
        $('#gender').text(bloggerInfo[4]);
        $('#phoneNumber').text(bloggerInfo[5]);
        $('#role').text(bloggerInfo[6]);
        $('#createAt').text(bloggerInfo[7]);

        
        $('#bloggerArticles').attr('action', `/admin/${bloggerInfo[1]}`);

        $('.button').click(function () {
            const buttonId = $(this).attr('id');
            $('#modal-container').removeAttr('class').addClass(buttonId);
            $('body').addClass('modal-active');
        });
    });

    $('#removeBlogger').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            url: `http://localhost:8000/admin/${bloggerInfo[1]}`,
            success: function (response) {
                console.log(response);
            }
        });
    });

    $('#passwordRecovery').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'PATCH',
            contentType: 'application/json; charset=utf-8',
            url: `http://localhost:8000/admin/${bloggerInfo[1]}`,
            success: function (response) {
                if (response === 'recovered') location.href = 'http://localhost:8000/admin';
                else console.log(response);
            }
        });
    });


    $('.close-btn').click(function () {
        $('.detail').text('');
        $('.detail-image').attr('src', 'images/avatars/default-avatar.png');
    });
});


function extractBloggerData(data) {
    const bloggerInfo = [];

    for (let index = 0; index < data.length; index++) {
        if (index === 0) bloggerInfo.push($(data[0]).children().attr('src'));
        else bloggerInfo.push($(data[index]).text());
    }

    return bloggerInfo;
};