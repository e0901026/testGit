// From https://github.com/EventedMind/meteor-file-uploader-part-2-server-side-save

/************************ Client *********************************************/

if (Meteor.isClient) {
  Template.form.events({
    "submit form": function (e, tmpl) {
      e.preventDefault();

      // Grab the file input control so we can get access to the
      // selected files
      var fileInput = tmpl.find('input[type=file]');

      // Grab the form so we can reset it after a successful upload
      var form = e.currentTarget;

      // We'll assign each file in the loop to this variable
      var file;

      for (var i = 0; i < fileInput.files.length; i++) {

        file = fileInput.files[i];
        
        // Read the file into memory
        MeteorFile.read(file, function (err, meteorFile) {
        
          // Make a Meteor method call passing a meteorFile
          Meteor.call("uploadFile", meteorFile, function (err) {
            if (err) 
              throw err;
            else
              form.reset();
          });
        });
      }
    }
  });
}
