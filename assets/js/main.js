
$(function() {
  io.sails.url = "http://vnmagic.net:1512";
  var socket = io.sails.connect();
  socket.get('/socket');

  //
  //  // This is called with the results from from FB.getLoginStatus().
  //  function statusChangeCallback(response) {
  //    console.log('statusChangeCallback');
  //    console.log(response);
  //    // The response object is returned with a status field that lets the
  //    // app know the current login status of the person.
  //    // Full docs on the response object can be found in the documentation
  //    // for FB.getLoginStatus().
  //    if (response.status === 'connected') {
  //      // Logged into your app and Facebook.
  //      testAPI();
  //    } else if (response.status === 'not_authorized') {
  //      // The person is logged into Facebook, but not your app.
  //      document.getElementById('status').innerHTML = 'Please log ' +
  //                                                    'into this app.';
  //    } else {
  //      // The person is not logged into Facebook, so we're not sure if
  //      // they are logged into this app or not.
  //      document.getElementById('status').innerHTML = 'Please log ' +
  //                                                    'into Facebook.';
  //    }
  //  }
  //
  // // This function is called when someone finishes with the Login
  // // Button.  See the onlogin handler attached to it in the sample
  // // code below.
  // function checkLoginState() {
  //   FB.getLoginStatus(function(response) {
  //     statusChangeCallback(response);
  //   });
  // }
  //
  // window.fbAsyncInit = function() {
  //   FB.init({
  //     appId      : '343633113334',
  //     cookie     : true,  // enable cookies to allow the server to access
  //                         // the session
  //     xfbml      : true,  // parse social plugins on this page
  //     version    : 'v2.8' // use graph api version 2.8
  //   });
  //
  //   // Now that we've initialized the JavaScript SDK, we call
  //   // FB.getLoginStatus().  This function gets the state of the
  //   // person visiting this page and can return one of three states to
  //   // the callback you provide.  They can be:
  //   //
  //   // 1. Logged into your app ('connected')
  //   // 2. Logged into Facebook, but not your app ('not_authorized')
  //   // 3. Not logged into Facebook and can't tell if they are logged into
  //   //    your app or not.
  //   //
  //   // These three cases are handled in the callback function.
  //
  //   FB.getLoginStatus(function(response) {
  //     statusChangeCallback(response);
  //   });
  //
  // };
  //
  // // Load the SDK asynchronously
  // (function(d, s, id) {
  //   var js, fjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) return;
  //   js = d.createElement(s); js.id = id;
  //   js.src = "//connect.facebook.net/en_US/sdk.js";
  //   fjs.parentNode.insertBefore(js, fjs);
  // }(document, 'script', 'facebook-jssdk'));
  //
  // // Here we run a very simple test of the Graph API after login is
  // // successful.  See statusChangeCallback() for when this call is made.
  // function testAPI() {
  //
  //   console.log('Welcome!  Fetching your information.... ');
  //   FB.api('/me', function(response) {
  //     console.log(JSON.stringify(response));
  //   });
  // }



  //USER MANAGEMENT
  // Khi submit script này sẽ chuyển data sang dạng socket và gửi đến server
  // UserController sẽ xử lý phần tiếp theo
  $('#login').submit(function (e) {
    console.log('gọi hàm submit');
    e.preventDefault();
    var checkStrEmail = $('#inputEmail').val().match('[!#$%^&*()<>|+~`/]');
    if (checkStrEmail != null) {
      alert('troll nhau hả chế ')
    } else {
    var data = $('#login').serialize();
    socket.get('/user/login?' + data);
    }
  });
  // Khi client nhận thông báo login-success từ server sẽ chuyển user sang trang home
  socket.on('user/login-success', function() {
    window.location = '/home';
  });

  $('#register').submit(function (r) {
    console.log('gọi hàm submit');
    r.preventDefault();
    var checkStrName = $('#inputName').val().match('[!@#$%^&*()<>|+~`/.]');
    var checkStrEmail = $('#inputEmail').val().match('[!#$%^&*()<>|+~`/]');
    var checkStrEmail1 = $('#inputEmail').val().match('[@]');
    var checkStrEmail2 = $('#inputEmail').val().match('[.]');
    if (checkStrName != null ) {
      $('#regModal p').text("Tên tài khoản không được chứa ký tự đặc biệt");
      $('#regModal').modal();
    }
    if (checkStrEmail != null ) {
      $('#regModal p').text("Bạn nhập cái méo gì ở đây vậy, nó đâu phải là Email, hay tính hack?");
      $('#regModal').modal();
    }
    else if (checkStrEmail1 == null || checkStrEmail2 == null ) {
      $('#regModal p').text("Dường như dữ liệu bạn nhập vào không phải là Email");
      $('#regModal').modal();
    }
    else if ($('#inputPassword').val().length < 8 ){
      $('#regModal p').text("Mật khẩu phải có ít nhất 8 ký tự");
      $('#regModal').modal();
    }
    else if ($('#inputPassword').val() != $('#inputVerify').val()){
      $('#regModal p').text("Xác nhận mật khẩu không trùng khớp, vui lòng kiểm tra lại");
      $('#regModal').modal();
    }  else {

    var data = $('#register').serialize();
    socket.get('/user/register?' + data);
    }
    });

  socket.on('user/registered', function() {
    $('#regModal p').text("Đăng ký thành công, hãy đăng nhập");
    $('#regModal').modal();
  });
  socket.on('user/exists', function() {
    $('#regModal p').text("Đã có người đăng ký tài khoản này");
    $('#regModal').modal();
  });


  // x-editable
  $.fn.editable.defaults.mode = 'inline';
  user_id = $(".user-info [static-userdata=id]").text();
  $('.user-info [userdata]').each(function(i,element){
    var keyToUpdate = $(element).attr('userdata');
    var title = ($(element).attr('title')) ? $(element).attr('title') : 'Vui lòng nhập để sửa thông tin';

    $(element).editable({
      type: 'text',
      url: '/user/' + user_id,
      pk: '',
      params: function(params) {
        var updateText = params['value'];
        delete params['pk'];
        delete params['name'];
        delete params['value'];
        params[keyToUpdate] = updateText;
        return params;
      }, title: title, ajaxOptions: {
        type: 'put'
      }
    });

  });

  // Xóa multi ID
  $("#removeid").click(function(event){
    event.preventDefault();
    var searchIDs = $("table input[type=checkbox]:checked").map(function() {
      return this.value;
    }).get().join();
    console.log("admin/userdel?id="+searchIDs);
    socket.get("/admin/userdel?id="+searchIDs)
  });
  //END USER MANAGEMENT

  // Category Manager Modal
  $('#manage_category tbody tr').each(function() {
    $(this).click(function(){
      var cat_name = $(this).find('td.cat_name').text();
      var cat_id = $(this).find('td.cat_id').text();
      var cat_description = $(this).find('td.cat_description').text();
      var cat_kind = $(this).find('td.cat_kind').text();
      var cat_column = $(this).find('td.cat_column').text();
      var cat_status = $(this).find('td.cat_status').text();
      $('#edit-category-form input[name=name]').val(cat_name);
      $('#edit-category-form input[name=id]').val(cat_id);
      $('#edit-category-form input[name=description]').val(cat_description);
      $('#edit-category-form input[name=column]').val(cat_column);
      $('#edit-category-form input[name=kind]').val(cat_kind);
      $('#del-category-form input[name=id]').val(cat_id);
      $('#delCategoryModal span.cat_name').html('<strong>'+cat_name+'</strong>');
      if(cat_status==1) {
        $('#edit-category-form .val1').attr('selected','selected')
      } else {
        $('#edit-category-form .val0').attr('selected','selected')
      }
    });

    $('#manage_category tbody tr a.edit_category').click(function(){
      $('#editCategoryModal').modal();
    });
    $('#manage_category tbody tr a.del_category').click(function(){
      $('#delCategoryModal').modal();
    })
  });

  $('#edit-category-form').submit(function(e) {
    $('#editCategoryModal').modal('hide');
    e.preventDefault();
    var data = $('#edit-category-form').serialize();
    socket.get('/admin/catid?' + data);
    location.reload();
  });

  $('#add-category-form').submit(function(a) {
    $('#addCategoryModal').modal('hide');
    a.preventDefault();
    var data = $('#add-category-form').serialize();
    socket.get('/admin/catadd?' + data);
    location.reload();
  });

  $('#del-category-form').submit(function() {
    $('#delCategoryModal').modal('hide');
    var id = $('#del-category-form input[name=id]').val();
    socket.get('/admin/catdel?id='+id);
    // $('#manage_category tr.tr-'+id).fadeOut('slow');
  });

  // POST Manager Modal
  $('#manage_post tbody tr').each(function() {

    $(this).click(function(){
      var post_name = $(this).find('td.post_name').text();
      var post_id = $(this).find('td.post_id').text();
      var post_description = $(this).find('td.post_description').text();
      var post_status = $(this).find('td.post_status').text();
      var post_source = $(this).find('td.post_source').text();
      var post_content = $(this).find('td.post_content').text();
      $('#edit-post-form input[name=name]').val(post_name);
      $('#edit-post-form input[name=id]').val(post_id);
      $('#edit-post-form input[name=description]').val(post_description);
      $('#edit-post-form textarea[name=content]').html(post_content);
      $('#edit-post-form input[name=source]').val(post_source);
      $('#del-post-form input[name=id]').val(post_id);
      $('#delPostModal span.post_name').html('<strong>'+post_name+'</strong>');
      if(post_status==1) {
        $('#edit-post-form .val1').attr('selected','selected')
      } else {
        $('#edit-post-form .val0').attr('selected','selected')
      }
    });

    $('#manage_post tbody tr a.edit_post').click(function(){
      $('#editPostModal').modal();
    });
    $('#manage_post tbody tr a.del_post').click(function(){
      $('#delPostModal').modal();
    })
  });



  $('#edit-post-form').submit(function(e) {
    e.preventDefault();
    var data = $('#edit-post-form').serialize();
    socket.get('/admin/postedit?' + data);
    location.reload();
  });

  $('#uploadForm').submit(function(u){
    $('#thumbnailModal').modal('hide');
    $('button#uploadDone').text('  Uploaded Successful');
    $('button#uploadDone').removeClass('btn-warning').addClass('btn-success')
  });
  socket.on('upload/thumbnail',function(data){
    $('#add-post-form input[name=thumbnail]').val(data.img);
  });

  $('#add-post-form').submit(function(a) {
    a.preventDefault();
    var data = $('#add-post-form').serialize();
    socket.get('/admin/postadd?' + data);
  });
  socket.on('new/post',function(){
    location.reload();
  });

  $('#del-post-form').submit(function() {
    $('#delPostModal').modal('hide');
    var id = $('#del-post-form input[name=id]').val();
    socket.get('/admin/postdel?id='+id);
    // $('#manage_category tr.tr-'+id).fadeOut('slow');
  });

  var getLink = window.location.href.substr().split("/");
  if ( getLink[3]+'/'+getLink[4] == "admin/newpost" || getLink[3]+'/'+getLink[4] == "article/add" || getLink[3]+'/'+getLink[4] == "admin/article") {
    CKEDITOR.replace('add-content');
  } else if ( getLink[3]+'/'+getLink[4] =="admin/postid" || getLink[3]+'/'+getLink[4] == "article/edit") {
    CKEDITOR.replace('edit-content');
  }

  if ( getLink[3]+'/'+getLink[4] =="category/view") {

  }


// Script to add active class on menu
  $(".navbar-left li a").each(function() {
    var path = $(location).attr('pathname');
    var param = $(location).attr('search');
    var currentUrl = path+''+param;
    var href = $(this).attr('href').trim();
    // var currentURI = path.substring((path.lastIndexOf('/') + 1), path.length);
    // currentURI = currentURI.replace(/^\//, "");
    // href = href.replace(/^\//, "");
    if (currentUrl === href) {
      $(this).closest('li').addClass('active');
    } else {
      $(this).closest('li').removeClass();
    }
  });


  // page onload
  $(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });

    // if (window.location.pathname == '/post/view') {
    //   var ogImg = $('input[name=ogthumb]').val();
    //   $('head').prepend('<meta property="og:type" content="photo" />');
    // // alert('ok')
    // }
  });

  $('#editPostModal').ready(function(){
    var catchCID = $('span.catch-cid').text();
    $('option[name=cid'+catchCID+']').attr('selected','selected')
  });

  $('#source').ready(function() {
    $('label[name=label-source]').css('color','#a94442');
    $('input#source').css({'color':'#a94442'});
    $('#icon_search').show();
    $('#icon_done').hide();
    $('#icon_load').hide();
  });

  $('#source').keyup(function () {
    $('#icon_search').hide();
    $('#icon_done').hide();
    $('#icon_load').show();
    if ($('#source').val().length == 11) {
      var labelSource = $('#source').val();
      socket.get('/youtube/search?id='+labelSource);
    }
  });

  socket.on('getdata/youtube',function(recieve) {
    var getTime = recieve.msg.duration;
    var videoDuration = getTime.split('PT');
    var duration = videoDuration[1];
    duration = duration.replace('H', ':');
    duration = duration.replace('M', ':');
    duration = duration.replace('S', '');
    $('#icon_search').hide();
    $('#icon_done').show();
    $('#icon_load').hide();
    $('label[name=label-source]').css('color','#3f8040');
    $('input#source').css({'color':'#3f8040'});
    $('#time').val(duration);
    $('span.getTime').text(duration);
    $('#thumbInput').val(recieve.getThumbUrl);
    $('input[name=thumbnail]').val(recieve.getThumbUrl);
    $('.getThumbnail').attr('src',recieve.getThumbUrl);
  });

  // phân trang - mỗi trang 12 phim
  var eachPage = 12;
  var soTrang = Math.floor((parseInt($('span.countPost').text())/eachPage)+1);
  var checkActive = window.location.search.split('page=');
  if (soTrang >= 5 && soTrang != 1) {
    for (var p=1; p <= soTrang; p++) {
      $('div.phantrang-home ul').append('<li class="page'+p+'"><a href="?page='+p+'>'+p+'</a></li>');
      var checkAnd = checkActive[0].split('');
      if (checkAnd[checkActive[0].length-1]=="&") $('div.phantrang-cat ul').append('<li class="page'+p+'"><a href="/category/view'+checkActive[0]+'page='+p+'">'+p+'</a></li>');
      else $('div.phantrang-cat ul').append('<li class="page'+p+'"><a href="/category/view'+checkActive[0]+'&page='+p+'">'+p+'</a></li>');
    }
    $('div.panel-footer ul li.page'+checkActive[1]).addClass('active');
  } else if (soTrang < 5 && soTrang != 1) {
    for (var p=1; p <= soTrang; p++) {
      $('div.phantrang-home ul').append('<li class="page'+p+'"><a href="?page='+p+'">'+p+'</a></li>');
      var checkAnd = checkActive[0].split('');
      if (checkAnd[checkActive[0].length-1]=="&") $('div.phantrang-cat ul').append('<li class="page'+p+'"><a href="/category/view'+checkActive[0]+'page='+p+'">'+p+'</a></li>');
      else $('div.phantrang-cat ul').append('<li class="page'+p+'"><a href="/category/view'+checkActive[0]+'&page='+p+'">'+p+'</a></li>');
    }
    $('div.panel-footer ul li.page'+checkActive[1]).addClass('active');
  }

});

// Image Upload with preview
function showMyImage(fileInput) {
  var files = fileInput.files;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /image.*/;
    if (!file.type.match(imageType)) {
      continue;
    }
    var img=document.getElementById("thumbnail");
    img.file = file;
    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }
}

$(document).ready(function() {
  $('#manage_post').DataTable();
  $('#manage_category').DataTable();

  // $('#panel-post .new-post').each(function() {
  //   if ($( window ).width() > 992) {
  //   var newTitle = $(this).find('span.post-title').text().substring(0, 48)+'...';
  //     $(this).find('span.post-title').text(newTitle);
  //   }
  // });
  $('#panel-post .new-post').each(function() {
    if ($(window).width() < 1070 && $(window).width() < 500) {
      var postTitle = $(this).find('span.post-title').text().substring(0, 26) + '...';
      $(this).find('span.post-title').text(postTitle);
    }
  });

  $('#panel-article .new-post').each(function() {

    if ($( window ).width() > 992) {
      var newTitle = $(this).find('span.post-desc').text().substring(0, 148)+'...';
      $(this).find('span.post-desc').text(newTitle);
    }
    if ($( window ).width() < 500) {
      var newTitle = $(this).find('span.post-desc').text().substring(0, 140)+'...';
      $(this).find('span.post-desc').text(newTitle);
    }
  })
} );



function chooseImg(e) {
  var thumbLink = $(e).find('img').attr('src');
  $('#add-post-form input[name=thumbnail]').val(thumbLink);
  $('#galleryModal').modal('hide')
}

function goBack() {
  window.history.back();
}

$('#post-content .panel-body').each(function(){
  var $this = $(this);
  var t = $this.text();
  $this.html(t.replace('&lt','<').replace('&gt', '>').replace(/\\r\\n/g, '<br />').replace(new RegExp("\\\\", "g"), ""));
});

$('#name').keyup(function () {
  //Lấy text từ thẻ input title
    var movieName = $('input[name=name]').val();
    //Đổi chữ hoa thành chữ thường
    var slug = movieName.toLowerCase();
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug =
      slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
        '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    //In slug ra textbox có id “slug”
    $('input[name=slug]').val(slug);
});

$('#search-key').keyup(function () {
  //Lấy text từ thẻ input title
  var inputKey = $('#search-key').val();
  //Đổi chữ hoa thành chữ thường
  var inputkey = inputKey.toLowerCase();
  //Đổi ký tự có dấu thành không dấu
  inputkey = inputkey.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  inputkey = inputkey.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  inputkey = inputkey.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  inputkey = inputkey.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  inputkey = inputkey.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  inputkey = inputkey.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  inputkey = inputkey.replace(/đ/gi, 'd');
  //Xóa các ký tự đặt biệt
  inputkey =
    inputkey.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      '');
  //Đổi khoảng trắng thành ký tự gạch ngang
  inputkey = inputkey.replace(/ /gi, "-");
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  inputkey = inputkey.replace(/\-\-\-\-\-/gi, '-');
  inputkey = inputkey.replace(/\-\-\-\-/gi, '-');
  inputkey = inputkey.replace(/\-\-\-/gi, '-');
  inputkey = inputkey.replace(/\-\-/gi, '-');
  //Xóa các ký tự gạch ngang ở đầu và cuối
  inputkey = '@' + inputkey + '@';
  inputkey = inputkey.replace(/\@\-|\-\@|\@/gi, '');
  //In slug ra textbox có id “slug”
  $('input[name=keyword]').val(inputkey);
});

$('#search-form').submit(function(a) {
  a.preventDefault();
  var keyword = $('input[name=keyword]').val();
  window.location.href = '/post/search?keyword='+keyword
});
