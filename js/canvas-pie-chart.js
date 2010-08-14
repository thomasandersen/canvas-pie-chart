/**/

function CanvasPieChart( containerElemId, data, options )
{

    if ( !options ) var options = {};

    var t = this;
    t.data = data || [];
    t.doc = options.doc || document;
    t.canvasWrapper = t.doc.getElementById( containerElemId );
    t.canvas = null;
    t.width = options.width || 400;
    t.height = options.height || 400;
    t.strokeLineWidth = options.strokeLineWidth || 2;


    function createCanvas()
    {
        var canvas = t.doc.createElement('canvas');

        canvas.id = containerElemId + '-canvas';
        canvas.width = t.width;
        canvas.height = t.height;

        t.canvasWrapper.appendChild(canvas);
        t.canvas = canvas;
    }


    function getTotal()
    {
        var total = 0, i;

        for ( i = 0; i < t.data.length; i++ )
        {
            total += (typeof t.data[i].value == 'number') ? t.data[i].value : 0;
        }

        return total;
    }


    function createPie() {
        var ctx,
                lastEnd = 0,
                total = getTotal(),
                width,
                height,
                centerX,
                centerY,
                label,
                value,
                color,
                radius,
                i;

        ctx = t.canvas.getContext("2d");
        width = t.canvas.width;
        height = t.canvas.height;
        centerX = width / 2;
        centerY = height / 2;
        radius = width / 2;

        ctx.clearRect( 0, 0, width, height );

        /*
        var shadowOffset = 3;
        ctx.beginPath();
        ctx.arc(centerX+shadowOffset, centerY+shadowOffset, width/2 - shadowOffset, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        */

        for ( i = 0; i < t.data.length; i++ )
        {
            label = t.data[i].label;
            value = t.data[i].value;
            color = t.data[i].color;

            ctx.lineWidth = t.strokeLineWidth;
            ctx.strokeStyle = "#FFFFFF";
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo( centerX, centerY );
            ctx.arc( centerX, centerY, radius, lastEnd, lastEnd + ( Math.PI * 2 * ( value / total ) ), false );
            ctx.lineTo( centerX, centerY );
            ctx.fill();
            ctx.stroke();

            lastEnd += Math.PI * 2 * ( value / total );
        }
    }

    createCanvas();
    createPie();
}