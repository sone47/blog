$('#main .login').bind('click', function(e) {
  e.preventDefault();

  Sone.ajax({
    method: 'post',
    url: '/admin',
    data: {
      name: $('#main .admin').val(),
      password: $('#main .password').val()
    },
    async : true,
    success: function(data) {
      data = JSON.parse(data);
      var code = data.code;
      var msg = data.msg;
      alert(msg);

      if (code === 0) {
        window.location.href = '/';
      }
    }
  });
});

$('#main .logout').bind('click', function(e) {
  e.preventDefault();

  Sone.ajax({
    method: 'get',
    url: '/logout',
    async : true,
    success: function(data) {
      data = JSON.parse(data);
      var code = data.code;
      var msg = data.msg;

      if (code === 0) {
        window.location.href = '/';
      } else {
        alert(msg);
      }
    }
  });
});