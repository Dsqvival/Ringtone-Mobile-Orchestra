var fav = function() {
  $.post('/items/' + curCoupon._id + '/fav', function(result) {
  	console.log(result)
    // callback
  });
};

var localFav = function () {
  var starred = JSON.parse(localStorage.getItem('starred'));

    if (starred != null) {
      starred.push(curCoupon);
      localStorage.setItem('starred', JSON.stringify(starred));
    } else {
      localStorage.setItem('starred', JSON.stringify([curCoupon]));
    }
};

var unfav = function() {
  $.post('/items/' + curCoupon._id + '/unfav', function(result) {
    console.log(result)
    // callback
  });
};

var localUnfav = function() {
    var starred = JSON.parse(localStorage.getItem('starred'));

    if (starred != null) {
      $.each(starred, function(i, v) {
        if (v.name == curCoupon.name) {
            starred.splice(i, 1);
            return;
        }
      });
      localStorage.setItem('starred', JSON.stringify(starred));
    } else {
      console.log('unstarred error');
    }
};

var del = function() {
  $.post('/items/' + curCoupon._id + '/del', function(result) {
    console.log(result)
    // callback
  });
};

var showStarred = function() {
  $('.img_star').hide();
  $('.img_starred').show();
  $('.img_starred').animate({
      opacity:1
    }, 'slow');
};

var showStarredAndReturn = function() {
  $('.img_star').hide();
  $('.img_starred').show();
  $('.img_starred').animate({
      opacity:1
    }, 'slow', function() {
      window.location = '/';
    });
};

var delAndReturn = function() {
    del();

    window.location = '/';
};

var hideStarred = function() {
  $('.img_starred').hide();
  $('.img_star').show();
};

var showStarIfFaved = function() {
  $.get('/items/' + curCoupon._id + '/faved', function(result) {
    if (result) {
      showStarred();
    }
  });
};

var showShare = function() {
  $('.share').show();
    $('.share').animate({
        opacity:1
      }, 'fast');
}

var hideShare = function() {
  $('.share').animate({
      opacity:0
    }, 'fast', function() {
      $(this).hide();
    });
}

window.onload = function() {
  showStarIfFaved();

  $('.img_star').on('click', function() {
  	fav();
    localFav();

    showStarredAndReturn();
  });

  $('.img_starred').on('click', function() { 
    unfav();
    localUnfav();

    hideStarred();

  });

  $('.ctrl_share').on('click', function() {
    showShare();
  });

  $('.share_cancel, .share_bg').on('click', function() {
    hideShare();
  });

  $('.ctrl_del').on('click', function() {
    delAndReturn();
  })

  // Gestures

  $('.result').swipeLeft(function(){
    showStarredAndReturn();
  })

  $('.result').swipeRight(function(){
    delAndReturn();
  })

  $('.result').swipeUp(function(){
    showShare();
  })

  $('.result, .share_bg').swipeDown(function(){
    hideShare();
  })

};
