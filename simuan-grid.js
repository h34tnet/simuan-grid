
// not really random, since it's intialized with average color values
function generateRandomPolyCollection(isize, res, ctxInit) {
    var 
		size = Math.floor(isize / res),
        pts = [],
        col = [];
		
	var idata = ctxInit.getImageData(0, 0, 255, 255).data;

    // create the points
    for (var y=0; y<size+1; y++) {
        pts[y] = [];
        for (var x=0; x<size+1; x++) {
            pts[y][x] = {y:y*res, x:x*res};
        }
    }

    // loop over all rectangles and get the avg color
    for (var y=0; y<=size; y++) {
        for (var x=0; x<=size; x++) {

            // the inner loops collect the average 
            // color of the underlying pixels
			var ic = {r: 0, g: 0, b: 0};
			
			for (var iy = 0; iy<res; iy++) {
				for (var ix = 0; ix<res; ix++) {
					var pos = ((y*res+iy) * isize + (x*res+ix))*4;
					ic.r += idata[pos+0];
					ic.g += idata[pos+1];
					ic.b += idata[pos+2];
				}
			}
			
			col.push({
                r: ic.r/(res*res),
                g: ic.g/(res*res),
                b: ic.b/(res*res)
            });
        }
    }

    return {
        pts: pts,
        col: col
    };
}

// draws the polygon collection to a canvas
function drawPolyCollection(ctx, polycol) {
    var size = polycol.pts.length,
        colIndex = 0,
        pts      = polycol.pts;

    for (var y=0; y<size-1; y++) {
        for (var x=0; x<size-1; x++) {
            var c = polycol.col[colIndex];

            ctx.beginPath();
            var fs = 'rgb(' + [c.r, c.g, c.b].map(Math.floor).join(',') + ')';
            ctx.fillStyle = fs;
            ctx.moveTo(pts[y][x].x, pts[y][x].y);
            ctx.lineTo(pts[y][x+1].x, pts[y][x+1].y);
            ctx.lineTo(pts[y+1][x+1].x, pts[y+1][x+1].y);
            ctx.lineTo(pts[y+1][x].x, pts[y+1][x].y);
            ctx.lineTo(pts[y][x].x, pts[y][x].y);
            ctx.fill();

            colIndex++;
        }
    }
}

// clone (aka deep copy) a polygoncollection
function clone(polycol) {
    var 
        npoly = {pts: [], col: []}
        opts = polycol.pts,
        wx = opts[0].length,
        wy = opts.length;

    // copy points
    for (var y=0; y<wy; y++) {
        npoly.pts[y] = [];

        for (var x=0; x<wx; x++) {
            npoly.pts[y][x] = {
                x: opts[y][x].x,
                y: opts[y][x].y
            }
        }
    }
	
    // copy colors
    for (var i=0, l = polycol.col.length; i<l; i++) {
        var c = polycol.col[i];
        npoly.col.push({
            r: c.r,
            g: c.g,
            b: c.b
        });
    }
	
    return npoly;
}


// moves one point slightly
function mutatePolyCollectionPoints(pc, mf) {
	var 
		w = pc.pts.length,
        // only change points which are not at the border
		mtx = Math.floor(Math.random() * (w-2))+1,
		mty = Math.floor(Math.random() * (w-2))+1,
		pt  = pc.pts[mty][mtx],
		mfh = mf/2;
	
	
	pt.x += Math.random()*mf-mfh;
	pt.y += Math.random()*mf-mfh;
}


// changes one color slightly
function mutatePolyCollectionColors(pc, mf) {
	var p = Math.floor(Math.random() * pc.col.length),
		c = pc.col[p];
		
		c = {
			r: Math.max(0, Math.min(255, c.r + Math.random()*4-2)),
			g: Math.max(0, Math.min(255, c.g + Math.random()*4-2)),
			b: Math.max(0, Math.min(255, c.b + Math.random()*4-2))
		}
}


// get fitness (must be drawn to work)
function getFitness(ctx, img, octx) {
    drawPolyCollection(ctx, img);
    return compareImages(ctx, octx);
}


// compare images byte for byte
// returns the added difference between every channel (save alpha) for the RGB
// for every single pixel
function compareImages(ctx1, ctx2) {
    var d   = 0;
    var id1 = ctx1.getImageData(0, 0, 256, 256);
    var id2 = ctx2.getImageData(0, 0, 256, 256);
    var l   = id1.data.length;

    for (var i=0; i<l; i += 4) {
        d += Math.abs(id1.data[i]   - id2.data[i]) +
             Math.abs(id1.data[i+1] - id2.data[i+1]) +
             Math.abs(id1.data[i+2] - id2.data[i+2]);
    }
    
    return d;
}
