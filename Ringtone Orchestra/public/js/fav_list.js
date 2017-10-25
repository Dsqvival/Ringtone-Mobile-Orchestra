var id = -1;

var unfav = function() {
  $.post('/items/' + id + '/unfav', function(result) {
    console.log(result)
    // callback
  });
};

var localUnfav = function() {
    var starred = JSON.parse(localStorage.getItem('starred'));

    if (starred != null) {
      $.each(starred, function(i, v) {
            if (v._id == id) {
                starred.splice(i, 1);
                return;
            }
        });
      localStorage.setItem('starred', JSON.stringify(starred));
    } else {
      console.log('unstarred error');
    }
}

window.onload = function() {

  $('.ctrl_unstar').on('click', function() {

    var $this = $(this);

    id = $this.data('id');
    console.log(id);

    unfav();
    localUnfav();

    $this.parent();
    $this.closest('li').animate({
        opacity:0,
      }, 'fast', function() {
        $(this).remove();
      });

  });

};
