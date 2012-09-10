
window.URL = window.URL || window.webkitURL;

// deflate

var decode = function ( string ) {

	return RawDeflate.inflate( window.atob( string ) );

};

var encode = function ( string ) {

	return window.btoa( RawDeflate.deflate( string ) );

};

//

var documents = [ {
	filename: 'Empty project',
	filetype: 'text/plain',
	autoupdate: true,
	code: decode( "s0nKT6m0s9EHU1w2xclFmQUlCsVFybZKGSUlBVb6+umJuZl56V7Besn5ufrO+SmprimZJflFbpkVqcV6WcVKQM0QXURoD8koSk3FrsmOS0FBX18hMr+0SCEZaItCen5qsUJGalGqnp4eF1w5AA==")
}, {
	filename: 'Spinning Multi-Sided Thingy',
	filetype: 'text/plain',
	autoupdate: true,
	code: decode( "jVRta9swEP68/ArRL1WHUdRCGMRpYfPSZWOF0RT2WbMusYYteSflraX/fZItZ/HiwYyx5bvnuXt0d/Lsh5GHu9m4eY1mNkdVO2Ixv70onKun4/FaVEqvvyxZbqpxZiTMpXIG79UeLPtpLzy5Zf0H/alAgGHS3YiQrUCSiwpQJMTmoCEhCFoCAqbRvQZTgcNDQirhAJUo/QpskY48QGnl6FWACq2CP3z4r9VG504ZHQHkxdtIm4HcEg078rR4nM/ZMlgip00nbA2586Cd0tLsmNIa8LuSriDjnm0Bal24tCG2W+hF/gbYRFJbyBovfTdJYvSEXPubc351Sme1sSqIZs8+0oTzdPSmUcyElLTFRELz6ArTS/s5N1YUINHoT9FPbzj36SK1K2KP9eDr+UFYlT9EL20L5qWZ0uCU8D1vroRE+04hrNBrmhKHGzi3f1U+fCjblNy0zteuzKF7Z+npeZ+j4j81CMQuSDcmvUCZ0FthH6OLxgAdlFlwWQkCs7CpBewp36+aawC4VM9Az2YgGRiBTpE0+aYC7Vg4Wcy6QwmsErhW2mvk6T8xZgu4Ks3Ooy4LJSXoyyGwqGsvLytUKelRqDTVvIQAarbw2pv945GI44/wawPWvW/MHnAf+kQj6rQ5DI1rEGzvRX30XqbNzsd5SzjzUzBJB6CHIej1X91i7YLGs34y1K+j4w/iNw==" )
} ];

if ( localStorage.codeeditor !== undefined ) {

	documents = JSON.parse( localStorage.codeeditor );

}

if ( window.location.hash ) {

	var hash = window.location.hash.substr( 1 );
	var version = hash.substr( 0, 2 );

	if ( version == 'A/' ) {

		alert( 'That shared link format is no longer supported.' );

	} else if ( version == 'B/' ) {

		documents[ 0 ].code = decode( hash.substr( 2 ) );

	}

}

// preview

var preview = document.createElement( 'div' );
preview.style.position = 'absolute';
preview.style.left = '0px';
preview.style.top = '0px';
preview.style.width = window.innerWidth + 'px';
preview.style.height = window.innerHeight + 'px';
document.body.appendChild( preview );

// editor

var interval;

var code = CodeMirror( document.body, {

	value: documents[ 0 ].code,
	mode: "text/html",
	lineNumbers: true,
	matchBrackets: true,

	onChange: function () {

		if ( documents[ 0 ].autoupdate === false ) return;

		clearTimeout( interval );
		interval = setTimeout( update, 300 );

	}

} );

var codeElement = code.getWrapperElement();
codeElement.style.position = 'absolute';
codeElement.style.width = window.innerWidth + 'px';
codeElement.style.height = window.innerHeight + 'px';
document.body.appendChild( codeElement );

// toolbar

var pad = function ( number, length ) {

	var string = number.toString();

	while ( string.length < length ) string = '0' + string;
	return string;

};

var codeToolbar = function() {
  var el = toolbar(
    buttonUpdate(),
    buttonHide(),
    buttonCodeMenu(),
    buttonInfo()
  );
};

var shortCodeToolbar = function() {
  var el = toolbar(
    buttonShow()
  );
};

var projectToolbar = function() {
  var el = toolbar(
    buttonSave(),
    buttonDownload(),
    buttonOpen(),
    buttonProjectMenu(),
    buttonInfo()
  );
};

var toolbar = function() {
  var buttons = Array.prototype.slice.apply(arguments);

  var old = document.getElementById('code-editor-toolbar');
  if (old) document.body.removeChild(old);

  var el = document.createElement( 'div' );
  el.id = 'code-editor-toolbar';
  el.style.position = 'absolute';
  el.style.right = '15px';
  el.style.top = '15px';
  document.body.appendChild( el );

  buttons.forEach(function(button) {
    el.appendChild(button);
  });
};

var buttonUpdate = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';

  var checkbox = document.createElement( 'input' );
  checkbox.type = 'checkbox';

  if ( documents[ 0 ].autoupdate === true ) checkbox.checked = true;

  checkbox.style.margin = '-4px 4px -4px 0px';
  checkbox.addEventListener( 'click', function ( event ) {

    event.stopPropagation();

	  documents[ 0 ].autoupdate = documents[ 0 ].autoupdate === false;

	  localStorage.codeeditor = JSON.stringify( documents );

  }, false );

  el.appendChild( checkbox );
  el.appendChild( document.createTextNode( 'update' ) );

  el.addEventListener( 'click', function ( event ) {

    update();

  }, false );

  return el;
};

var buttonSave = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'save';
  el.addEventListener( 'click', function ( event ) {

    openSaveDialog();

  }, false );

  return el;
};

var buttonDownload = function() {
  var el = document.createElement( 'a' );
  el.className = 'button';
  el.download = 'index.html';
  el.textContent = 'download';
  el.addEventListener( 'click', function ( event ) {

    download(event.target);

  }, false );

  return el;
};

var buttonOpen = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'open';
  el.addEventListener( 'click', function ( event ) {

    openProjectsDialog();

  }, false );
  return el;
};

var buttonShare = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'share';
  el.addEventListener( 'click', function ( event ) {

    window.location.replace( '#B/' + encode( code.getValue() ) );

  }, false );
  return el;
};

var buttonHide = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'hide code';
  el.addEventListener( 'click', function ( event ) {

  	toggle();

  }, false );
  return el;
};

var buttonShow = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'show code';
  el.addEventListener( 'click', function ( event ) {

  	toggle();

  }, false );
  return el;
};

var buttonCodeMenu = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'switch menu';
  el.title = 'Switch to project menu';
  el.addEventListener( 'click', function ( event ) {

  	projectToolbar();

  }, false );

  return el;
};

var buttonProjectMenu = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'switch menu';
  el.title = 'Switch to code menu';
  el.addEventListener( 'click', function ( event ) {

  	codeToolbar();

  }, false );

  return el;
};

var buttonInfo = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = '?';
  el.addEventListener( 'click', function ( event ) {

    window.open( 'https://github.com/mrdoob/code-editor' );

  }, false );

  return el;
};

// dialogs
var saveDialog = document.createElement( 'div' );
saveDialog.className = 'dialog';
saveDialog.style.position = 'absolute';
saveDialog.style.right = '15px';
saveDialog.style.top = '60px';
saveDialog.style.display = 'none';
document.body.appendChild( saveDialog );

var saveFileLabel = document.createElement( 'label' );
saveFileLabel.textContent = 'Name:';
saveDialog.appendChild( saveFileLabel );

var saveFileField = document.createElement( 'input' );
saveFileField.type = 'text';
saveFileField.size = 30;
saveFileField.value = documents[ 0 ].filename;
saveFileLabel.appendChild( saveFileField );

var buttonSaveDialog = document.createElement( 'button' );
buttonSaveDialog.className = 'button';
buttonSaveDialog.textContent = 'Save';
buttonSaveDialog.addEventListener( 'click', function ( event ) {

    save(saveFileField.value);
    closeSaveDialog();

}, false );
saveDialog.appendChild( buttonSaveDialog );

var closeSaveP = document.createElement( 'p' );
closeSaveP.className = 'cancel';
saveDialog.appendChild( closeSaveP );

var closeSaveLink = document.createElement( 'a' );
closeSaveLink.href = '#';
closeSaveLink.textContent = '[ close ]';
closeSaveLink.addEventListener( 'click', function ( event ) {

  closeSaveDialog();
  event.stopPropagation();
	event.preventDefault();

}, false );
closeSaveP.appendChild( closeSaveLink );


// events

document.addEventListener( 'drop', function ( event ) {

	event.preventDefault();
	event.stopPropagation();

	var file = event.dataTransfer.files[ 0 ];

	documents[ 0 ].filename = file.name;
	documents[ 0 ].filetype = file.type;

	var reader = new FileReader();

	reader.onload = function ( event ) {

		code.setValue( event.target.result );

	};

	reader.readAsText( file );

}, false );

document.addEventListener( 'keydown', function ( event ) {

	if ( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ) {

		event.preventDefault();
		openSaveDialog();

	}

	if ( event.keyCode === 13 && ( event.ctrlKey === true || event.metaKey === true ) ) {

		update();

	}

	if ( event.keyCode === 27 ) {

		toggle();

	}

}, false );

window.addEventListener( 'resize', function ( event ) {

	codeElement.style.width = window.innerWidth + 'px';
	codeElement.style.height = window.innerHeight + 'px';

	preview.style.width = window.innerWidth + 'px';
	preview.style.height = window.innerHeight + 'px';

} );

// actions

var update = function () {

	while ( preview.children.length > 0 ) {

		preview.removeChild( preview.firstChild );

	}

	var iframe = document.createElement( 'iframe' );
	iframe.style.width = '100%';
	iframe.style.height = '100%';
	iframe.style.border = '0';
	preview.appendChild( iframe );

	var content = iframe.contentDocument || iframe.contentWindow.document;

	content.open();
	content.write( code.getValue() );
	content.close();

};

var openProjectsDialog = function() {
  closeProjectsDialog();

  var projectsDialog = document.createElement( 'div' );
  projectsDialog.id = 'projects-dialog';
  projectsDialog.className = 'dialog';
	projectsDialog.style.position = 'absolute';
  projectsDialog.style.right = '15px';
  projectsDialog.style.top = '60px';
	projectsDialog.style.border = '1px solid rgba(0,0,0,0.25)';
  projectsDialog.style.padding = '8px 8px 4px';
  document.body.appendChild( projectsDialog );

  documents.forEach(function(doc) {
    projectsDialog.appendChild(projectsDialogRow(doc));
  });

  var closeP = document.createElement( 'p' );
  closeP.className = 'cancel';
  projectsDialog.appendChild( closeP );

  var closeLink = document.createElement( 'a' );
  closeLink.href = '#';
  closeLink.textContent = '[ close ]';
  closeLink.addEventListener( 'click', function ( event ) {

    closeProjectsDialog();
    event.stopPropagation();
		event.preventDefault();

  }, false );
  closeP.appendChild( closeLink );
};

var projectsDialogRow = function(doc) {
  var row = document.createElement( 'p' );

  var link = document.createElement( 'a' );
  link.href = '#';
  link.textContent = doc.filename;
  link.addEventListener( 'click', function ( event ) {

    changeProject(doc.filename);
    closeProjectsDialog();
    event.stopPropagation();
		event.preventDefault();

  }, false );
  row.appendChild(link);

  return row;
};

var changeProject = function(filename) {
  var new_documents = [];

  var i = 0, found;
  while (i < documents.length) {
    if (documents[i].filename == filename) {
      found = documents[i];
    }
    else {
      new_documents.push(documents[i]);
    }
    i++;
  }

  if ( ! found ) return;

  new_documents.unshift(found);
  documents = new_documents;
  code.setValue( documents[ 0 ].code);
  update();
};

var closeProjectsDialog = function() {
  var dialog = document.getElementById('projects-dialog');
  if ( ! dialog ) return;

  dialog.parentElement.removeChild(dialog);
};

var openSaveDialog = function() {
  saveDialog.style.display = '';
  saveFileField.value = documents[ 0 ].filename;
  saveFileField.focus();
};

var closeSaveDialog = function() {
  saveDialog.style.display = 'none';
};

var save = function (title) {

  if ( documents[ 0 ].filename != title) {
    documents.unshift({
      filetype: 'text/plain',
      autoupdate: documents[ 0 ].autoupdate
    });
  }

	documents[ 0 ].code = code.getValue();
  documents[ 0 ].filename = title;

	localStorage.codeeditor = JSON.stringify( documents );
};

var download = function(el) {
	var blob = new Blob( [ code.getValue() ], { type: documents[ 0 ].filetype } );
	var objectURL = URL.createObjectURL( blob );

	el.href = objectURL;

	el.download = documents[ 0 ].filename;
};

var toggle = function () {

	if ( codeElement.style.display === '' ) {

    shortCodeToolbar();
		codeElement.style.display = 'none';

	} else {

    codeToolbar();
		codeElement.style.display = '';

	}

};

codeToolbar();
update();
