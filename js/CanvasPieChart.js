/**
 * CanvasPieChart.js
 *
 * Copyright 2010, Thomas Andersen
 * Released under LGPL License.
 *
 * Contributing: http://github.com/thomasandersen/canvas-pie-chart
 */

function CanvasPieChart( elementId, userData, userOptions )
{
    var defaultOptions = {
        doc : document,
        imgDir : 'images/',
        width : 400,
        height : 400,
        strokeLineWidth : 2,
        strokeLineColor : '#FFFFFF',
        ticks : true,
        font : 'Arial',
        fontSize : 11,
        fontColor : '#FFFFFF',
        imageMap : true,
        onSectorMouseOver : function() {},
        onSectorClick : function() {},
        sectorTextRendrer : function( data, total ){
            return Math.round( data.value / total * 100 ) + '%';                                        
        }
    };

    var options = {};

    setOptions( userOptions );

    var data = userData || [],
        canvas = null,
        ctx = null,
        canvasWrapper = options.doc.getElementById( elementId ),
        total = getTotal();


    function setOptions( o )
    {
        if ( typeof userOptions == 'object' )
        {
            var key;

            for ( key in o )
            {
                defaultOptions[key] = o[key];
            }

            options = defaultOptions;
        }
        else
        {
            options = defaultOptions;
        }
    }


    function getTotal()
    {
        var t = 0, i;

        for ( i = 0; i < data.length; i++ )
        {
            t += (typeof data[i].value == 'number') ? data[i].value : 0;
        }

        return t;
    }
    

    function createCanvas()
    {
        canvas = options.doc.createElement( 'canvas' );
        canvas.id = elementId + '-canvas';
        canvas.width = options.width;
        canvas.height = options.height;

        canvasWrapper.appendChild( canvas );

        ctx = canvas.getContext( '2d' );
    }


    function createPieChart()
    {
        var arcStartAngle,
            arcEndAngle,
            width,
            height,
            centerX,
            centerY,
            label,
            value,
            color,
            radius,
            i,
            index,
            val,
            percent,
            midAngle,
            labelX,
            labelY,
            tickText,
            tickTextWidth;


        width = canvas.width;
        height = canvas.height;
        centerX = width / 2;
        centerY = height / 2;
        radius = width / 2 - options.strokeLineWidth; // -1 when strokeLineWidth is not 0

        index = 0;

        // Create the pie
        ctx.clearRect( 0, 0, width, height );

        for ( i = 0; i < data.length; i++ )
        {
            label = data[i].label;
            value = data[i].value;
            color = data[i].color;
            val = value / total;
            percent = Math.round( val * 100 );

            arcStartAngle = Math.PI * ( - 0.5 + 2 * index ); // -0.5 sets set the start to be top
            arcEndAngle = Math.PI * ( - 0.5 + 2 * ( index + val ) );
            
            ctx.lineWidth = options.strokeLineWidth;
            ctx.strokeStyle = options.strokeLineColor;
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo( centerX, centerY );
            ctx.arc( centerX, centerY, radius, arcStartAngle, arcEndAngle, false );
            ctx.lineTo( centerX, centerY );
            ctx.fill();
            if ( options.strokeLineWidth != 0) // stroke appears even if its value is 0
            {
                ctx.stroke();
            }

            index += val; // increment progress tracker
        }


        // Add sector text
        if ( options.sectorTextRendrer )
        {
            index = 0;

            for ( i = 0; i < data.length; i++ )
            {
                value = data[i].value;
                color = data[i].color;
                val = value / total;

                arcStartAngle = Math.PI * ( - 0.5 + 2 * index ); // -0.5 sets set the start to be top
                arcEndAngle = Math.PI * ( - 0.5 + 2 * ( index + val ) );

                ctx.font = options.fontSize + 'px ' + options.font;

                tickText = options.sectorTextRendrer( data[i], total );
                tickTextWidth = ctx.measureText( tickText ).width;

                midAngle = ( arcStartAngle + arcEndAngle ) / 2;
                labelX = centerX + Math.cos( midAngle ) * radius/1.2 - tickTextWidth/2;
                labelY = centerY + Math.sin( midAngle ) * radius/1.2;
                
                ctx.fillStyle = options.fontColor;
                ctx.fillText( tickText, labelX, labelY );

                index += val; // increment progress tracker
            }
        }

    }


    function createImageMap()
    {
       var arcStartAngle,
           arcEndAngle,
           arcIncrement,
           pieVertices,
           arcIncrementMultiplier,
           label,
           value,
           radius,
           index,
           val,
           shim,
           imageMap,
           area,
           coord,
           coordIndex,
           arcAngle,
           percent,
           i,j,x,y, xEnd, yEnd;

        canvasWrapper.style.position = 'relative';

        shim = options.doc.createElement( 'img' );
        shim.src = options.imgDir + 'pix.png';
        shim.border = 0;
        shim.width = canvas.width;
        shim.height = canvas.height;
        shim.style.position = 'absolute';
        shim.style.left = 0;
        shim.style.top = 0;
        shim.useMap = '#' + elementId + '-image-map';

        canvasWrapper.appendChild(shim);

        imageMap = options.doc.createElement( 'map' );
        imageMap.name = elementId + '-image-map';

        canvasWrapper.appendChild( imageMap );

        radius = canvas.width / 2;
        pieVertices = 12; // Does not include the center vertex
        arcIncrementMultiplier = 1 / pieVertices;
        index = 0;

        for ( i = 0; i < data.length; i++ )
        {
            label = data[i].label;
            value = data[i].value;
            val = value / total;
            percent = val * 100;
            arcStartAngle = Math.PI * ( - 0.5 + 2 * index ); // -0.5 sets set the start to be top
            arcEndAngle = Math.PI * ( - 0.5 + 2 * ( index + val ) );
            arcIncrement = (arcEndAngle - arcStartAngle) * arcIncrementMultiplier;
			x = radius + Math.round(Math.cos(arcStartAngle) * radius);
			y = radius + Math.round(Math.sin(arcStartAngle) * radius);
			coord = [];
			coordIndex = 1;

			for ( j = 0; j < ((pieVertices * 2) - 2); j = j+2 ) {
				arcAngle = arcStartAngle + arcIncrement * coordIndex;
				coord[j] = radius + Math.round( Math.cos( arcAngle ) * radius );
				coord[j+1] = radius + Math.round( Math.sin( arcAngle ) * radius );
				coordIndex++;
			}

			xEnd = radius + Math.round( Math.cos(arcEndAngle ) * radius );
			yEnd = radius + Math.round( Math.sin(arcEndAngle ) * radius );

            area = options.doc.createElement( 'area' );
            area.shape = 'poly';
            area.coords = radius + ',' + radius + ','  + x + ',' + y + ',' + coord.join( ',' ) +  ',' + xEnd + ',' + yEnd;

            //area.title = label;
            area.data = data[i];
            area.data.key = i;

            if ( options.onSectorClick )
            {
                area.style.cursor = 'pointer';

                area.addEventListener( 'click', function( evt ) {
                    return options.onSectorClick( evt, this.data );
                }, false );
            }

            if ( options.onSectorMouseOver )
            {
                area.addEventListener( 'mouseover', function( evt ) {
                    return options.onSectorMouseOver( evt, this.data );
                }, false );
            }

            imageMap.appendChild( area );

            index += val; // increment progress tracker
        }
    }

    createCanvas();
    createPieChart();
    if ( options.imageMap ) // sometimes, the imageMap isn't necesary
    {
        createImageMap();
    }
}