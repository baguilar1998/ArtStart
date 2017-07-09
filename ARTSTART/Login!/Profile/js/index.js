var firebaseURL = 'https://commentunderpicture.firebaseio.com/';
var myDataRef = new Firebase(firebaseURL);
var messageTemplate = '<div class="alert alert-dismissable alert-{0} none" data-name="{3}"><button type="button" class="close btnRemove" data-dismiss="alert">×</button><b>{1}</b>: {2}</div>';

$(document).ready(function() {
  
  $('#messageInput').keypress(function(e) {
    if (e.keyCode == 13) sendComment();
  });
  
  $('.form-control').on('change', function(){
    if ($(this).val()) $(this).removeClass('error');
    else $(this).addClass('error');
  })

  $('#btnSubmit').click(function() {
    sendComment();
    return false;
  });

  $('#messagesDiv').on('click', '.btnRemove', function() {
    var $parent = $(this).parent();
    var rmObject = new Firebase(firebaseURL + '/' + $parent.data('name'));

    rmObject.remove();
    rmObject = null;
  });

  myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage((message.subject || 'info'), message.name, message.text, snapshot.name());
  });
  
  function displayChatMessage(subject, name, text, id) {
  	var comment = $(messageTemplate.format(subject, name, text, id)); 
  	$('#messagesDiv').append(comment);
  	comment.show('slow');
  
  	$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
	}

  function sendComment() {
    $('.error').removeClass('error');
    
    var $name = $('#nameInput'),
    $text = $('#messageInput'),
    $subject = $('#subjectInput');
    
    if (!$subject.val() || !$name.val() || !$text.val()) {
      if (!$text.val()) $text.addClass('error');
      if (!$name.val()) $name.addClass('error');
      if (!$subject.val()) $subject.addClass('error');
      
      return false;
    }

    myDataRef.push({
      name: $name.val(),
      text: $text.val(),
      subject: $subject.val()
    });

    $('#messageInput').val('');
    $('#subjectInput option:eq(0)').prop('selected', true);
  }
  
  function validateForm() {}
  
});


String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};