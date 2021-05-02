$(document).ready(function () {
    $('#removeArticle').on('submit', function (e) {
        e.preventDefault();

        const formAction = $('#removeArticle').attr('action');

        $.ajax({
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            url: `http://localhost:8000/admin/${formAction}`,
            success: function (response) {
                console.log(response);
            }
        });
    });


    $('#articleRemove').on('submit', function (e) {
        e.preventDefault();

        const formAction = $('#articleRemove').attr('action');

        $.ajax({
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            url: `http://localhost:8000/admin/${formAction}`,
            success: function (response) {
                console.log(response);
            }
        });
    });
});