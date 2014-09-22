toggleDialog(id) ->
    dialog = document.querySelector 'paper-dialog#' + id
    dialog.toggle()
