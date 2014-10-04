toggleDialog(id)(function() {
  var dialog;
  dialog = document.querySelector('paper-dialog#' + id);
  return dialog.toggle();
});
