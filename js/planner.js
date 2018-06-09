// vi: ft=javascript

function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}

var selected = undefined;

function add( data ) {
    var option = $( '<div class="option"></div>' );

    var header = $( '<div class="header"></div>' );
    header.appendTo( option );

    var tags_required = $( '<input type="text" class="tags_required" placeholder="tags required"/>' );
    tags_required.appendTo( header );

    var tags_to_add = $( '<input type="text" class="tags_to_add" placeholder="tags to add"/>' );
    tags_to_add.appendTo( header );

    var message = $( '<textarea class="message" placeholder="message"></textarea>' );
    message.appendTo( option );

    option.click( function() { 
        if( selected !== undefined ) {
            selected.removeClass( "selected" );
        }
        selected = $( this );
        selected.addClass( "selected" );
    });

    if( data !== undefined ) {
        tags_required.val( data.tags_required );
        tags_to_add.val( data.tags_to_add );
        message.val( data.message );
    }

    option.appendTo( document.body );
}

function save() {
    var location = $( '#location' ).val();
    var story = $( '#story' ).val();
    var description = $( '#description' ).val();
    var messages = [];
    
    var options = $( '.option' );
    var n_options = options.length;

    for( var i = 0; i < n_options; i++ ) {
        var option = $( options[ i ] );
        var tags_required = option.find( '.tags_required' ).val();
        var tags_to_add = option.find( '.tags_to_add' ).val();
        var message = option.find( '.message' ).val();
        messages.push({
            tags_required: tags_required,
            tags_to_add: tags_to_add,
            message: message,
        });
    }

    var data = {
        location: location,
        story: story,
        description:description,
        messages: messages,
    };

    data = encode( JSON.stringify( data, null, 4));
    var blob = new Blob( [ data ], {
            type: 'application/octet-stream'
    });
    
    url = URL.createObjectURL( blob );
    var link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', ( story || "story" ) + '.json' );
    
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );
}

$(document).ready( function() {
    $( '#add' ).click( add );
    $( '#save').click( save );

    $( '#load' ).on( 'click', function() {
        var fileInput = $('#selectFiles');
        fileInput.click()
    });

    $( '#selectFiles' ).change( function() {
        var files = $( '#selectFiles' )[0].files;
        var fr = new FileReader();

        fr.onload = function(e) { 
            var result = JSON.parse(e.target.result);
            $( '#location' ).val( result.location || '' )
            $( '#story' ).val( result.story || '' )
            $( '#description' ).val( result.description || '' )
            $( '.option' ).remove();
            var n_messages = result.messages.length;
            for( var i = 0; i < n_messages; i++ ) {
                add( result.messages[ i ] );
            }

        }
        fr.readAsText(files.item(0));
    });

    $( '#delete' ).click( function() {
        if( selected !== undefined ) {
            selected.remove();
            selected = undefined;
        }
    });

} );

