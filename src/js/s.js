/* 2do
----------------	
	
	resolution multiply/divide2/setToNumber
	random => seed		
	
	/// #FiltersList
			// .filter
				// values +/-,range
				// apply
				// remove
		// undo / redo (steps?)
		// save/export FiltersList

	/// rivers	
	/// towns/cities/castles	
	/// roads
	/// nations/kingdoms		
----------------
*/
var worldgen = {
	td : 					2,
	mw:					450,
	mh:					250,
	absHmax :			1000,
	sealevel : 			100,
	temperatur : 		[-100,0,100],
	biomes :			{
		'Water' : 			[	0,		100,		[0,50,142],		[44,118,255]],
		'Lowlands' : 		[	100,	500,		[138,158,75],		[0,100,75]],
		'Highlands' : 		[	500,	750,		[0,100,75],		[64,53,17]],
		'Mountains' : 		[	750,	1000,	[180,180,180],	[200,200,200]]
	},
	hl_biomeborders: false,
	map:					{},
	rivers:				{},
	cultures:			{},
	colormap			: true,
	actFilter			: '',
	cana					: 1,
	cani					: 0,
	FilterList : 			[],
	FilterTime	:		1,
	Fi :					0,
	FLrunning :		true,
	PrintAfterFilterapply : true,
	Options :			{
		'colormap' :  	function (pthis){
			if (pthis.colormap == 'false'){
				pthis.colormap = false;
			}
			if (pthis.colormap == 'true'){
				pthis.colormap = true;
			}	
			return pthis.colormap;			
		},		
		'mw' :  			function (pthis){return pthis.mw},
		'mh' : 			function (pthis){return pthis.mh},
		'td' : 				function (pthis){return pthis.td},
		
	},
	FilterListPresets :	{
		'# default' : function(pthis){
			pthis.map = [];
			var Mw = pthis.mw;
			var Mh = pthis.mh;
			var sMd = Math.min(Mw,Mh);
			var sl = pthis.sealevel;
			var cmap = pthis.map;
			var td = pthis.td;		
			var bw = Math.round(Mw*0.1);
			var bh = Math.round(Mh*0.1);
			var aHm = pthis.absHmax;
			var trad,tx,ty,tl,thm;
			var pTL = pthis.FilterList;
				
			pthis.FilterList.push(['setHto',true,aHm]);	
		
		},
		'# test 1 #' : function(pthis){
		
			pthis.map = [];
			var Mw = pthis.mw;
			var Mh = pthis.mh;
			var sMd = Math.min(Mw,Mh);
			var sl = pthis.sealevel;
			var cmap = pthis.map;
			var td = pthis.td;		
			var bw = Math.round(Mw*0.1);
			var bh = Math.round(Mh*0.1);
			var aHm = pthis.absHmax;
			var trad,tx,ty,tl,thm;
			var pTL = pthis.FilterList;
			
			pTL.push(['setHto',false,10]);
			tx = Mw/2;
			ty = Mh/2;
			tr = Math.ceil(sMd/3)
			pTL.push(['sphere',tx,ty,tr,0,aHm,aHm]);	
			pTL.push(['RanH',sl+50,aHm,50]);	
			pTL.push(['genRivers']);		
			pTL.push(['genRivers']);		
			pTL.push(['genRivers']);		
			
			//pTL.push(['BlurH',sl-5,aHm,1]);	
			
	
		},	
		'# Griddy World' : function(pthis){
			pthis.map = [];
			var Mw = pthis.mw;
			var Mh = pthis.mh;
			var sMd = Math.min(Mw,Mh);
			var sl = pthis.sealevel;
			var cmap = pthis.map;
			var td = pthis.td;		
			var bw = Math.round(Mw*0.1);
			var bh = Math.round(Mh*0.1);
			var aHm = pthis.absHmax;
			var trad,tx,ty,tl,thm;
			var pTL = pthis.FilterList;
			var gridmap = [];
			
			
			pTL.push(['setHto',true,10]);
			
			function genGridMap(grid_tiled){
				tgridmap = [];
				var grid_w_tiles = Math.floor(Mw/grid_tiled);
				var grid_h_tiles = Math.floor(Mh/grid_tiled);
				var index = 0;
				for (var ix=1;ix<grid_w_tiles-1;ix++){
					for (var iy=1;iy<grid_h_tiles-1;iy++){
						tgridmap[index] = [ix,iy,Math.floor(Math.random()*(aHm))];			
						index++;
					}
				}
				return tgridmap;
			}
			
			var grid_tiled = Math.floor(sMd*(0.2));
			gridmap = genGridMap(grid_tiled);
			
			for (var i in gridmap){
				tx = Math.floor((gridmap[i][0]*grid_tiled) + (grid_tiled/2));
				ty = Math.floor((gridmap[i][1]*grid_tiled) + (grid_tiled/2));
				pTL.push(['sphere',tx,ty,grid_tiled,-1,aHm,Math.floor(gridmap[i][2]/2)]);			
			}
			

			
			pTL.push(['Noise',1,-1,aHm*2]);	
			pTL.push(['BlurH',-1,aHm*2,1]);
			
			var ria = 32;
			for (var i=0;i<ria;i++){
				pTL.push(['genRivers']);
			}			

			
			
			
			
		
		},		
		'# Triple Peaks' : function(pthis){
			pthis.map = [];
			var Mw = pthis.mw;
			var Mh = pthis.mh;
			var sMd = Math.min(Mw,Mh);
			var sl = pthis.sealevel;
			var cmap = pthis.map;
			var td = pthis.td;		
			var bw = Math.round(Mw*0.1);
			var bh = Math.round(Mh*0.1);
			var aHm = pthis.absHmax;
			var trad,tx,ty,tl,thm;
			var pTL = pthis.FilterList;
			
	
			pTL.push(['setHto',true,50]);
			pTL.push(['moveH',-1,10,10]);
			
			ia = 3;
			for (var i=0;i<ia;i++){
				mrad = Math.floor(sMd*0.4);
				tx = (bw*2)+Math.ceil((i*(Mw-(bw*4))/ia))+(mrad/2);
				ty = Math.round(Mh/2);
				minh = 0;
				maxh = sl;
				hval = 500;
				pTL.push(['sphere',tx,ty,mrad,minh,maxh,hval]);

				maxh = sl*2;
				hval = 500;
				pTL.push(['sphere',tx,ty,mrad,minh,maxh,hval]);
			}
			ra = 36;
			for (var i =0;i<ra;i++){
				mrad =  Math.ceil((sMd*0.1) +(Math.random()*(sMd*0.2)));
				tx = mrad+Math.floor(Math.random()*(Mw-(mrad*2)));
				ty = mrad+Math.floor(Math.random()*(Mh-(mrad*2)));
				
				minh = sl+1;
				maxh = aHm;
				hval = Math.ceil(((aHm/20)));
				pTL.push(['sphere',tx,ty,mrad,minh,maxh,hval]);
			}
			
			ax = 0;
			ay = Math.round(Mh/2);
			bx = Mw;
			by = Math.round(Mh/2);
			
			linewidth = 10;
			minh = sl;
			maxh = aHm*10;
			hval = 500;
			
			pTL.push(['line',ax,ay,bx,by,25,minh,maxh,500]);
			pTL.push(['line',ax,ay,bx,by,12,minh,maxh,750]);
			pTL.push(['line',ax,ay,bx,by,3,minh,maxh,1000]);
	
			pTL.push(['Noise',1,sl+100,aHm]);	
			pTL.push(['BlurH',-1,aHm,3]);
			pTL.push(['RanH',sl+50,aHm,50]);	
			pTL.push(['SmoothH',sl*0.75,aHm,2]);	
			pTL.push(['genRivers']);			
			pTL.push(['BlurH',aHm/2,aHm,1]);				
		},
		'# Simple Continent' : function(pthis){
		
			pthis.map = [];
			var Mw = pthis.mw;
			var Mh = pthis.mh;
			var sMd = Math.min(Mw,Mh);
			var sl = pthis.sealevel;
			var cmap = pthis.map;
			var td = pthis.td;		
			var bw = Math.round(Mw*0.1);
			var bh = Math.round(Mh*0.1);
			var aHm = pthis.absHmax;
			var trad,tx,ty,tl,thm;
			var pTL = pthis.FilterList;
			
			pTL.push(['setHto',true,10]);
			
			tx = Math.floor(Mw/2);
			ty = Math.floor(Mh/2);
			mrad = Math.floor(sMd/3);
			minh = -1;
			maxh = aHm*2;
			hval = aHm;
					
			pTL.push(['sphere',tx,ty,mrad,minh,maxh,hval]);
									
			
			
			var lines_A = 32;
			var tlevel_a = 0;
			var tlevel_b = 0;
			
			for (var i = 1;i<lines_A+1;i++){
				i = parseInt(i);
				tlevel_a = Math.floor((750/lines_A)*(i-1));
				tlevel_m = Math.floor((750/lines_A)*(i));
				tlevel_b =Math.floor((750/lines_A)*(1+i));
				
				if (i % 2 == 0){					
					afx = ((Mw/2)-(mrad))+(Math.random()*(mrad*2));
					afy = Math.floor((Mh-(mrad*2))/2);
					bfx = ((Mw/2)-(mrad))+(Math.random()*(mrad*2));
					bfy = Mh-afy;					
				}else{
					afx = Math.floor((Mw-(mrad*2))/2);
					afy = mrad+Math.floor(Math.random()*(Mh-(mrad*2)));
					bfx = Mw-afx;
					bfy = mrad+Math.floor(Math.random()*(Mh-(mrad*2)));
					//pTL.push(['Noise',1,-1,aHm*2]);	
				}
				
				vti =  Math.ceil((lines_A-i)/2);
				thm = Math.floor(Math.random()*aHm/2);
				pTL.push(['line',afx,afy,bfx,bfy,vti,sl-75,maxh,thm]);
			
				
				
				minh = -1;
				hval = aHm/2;
				trad = Math.ceil(sMd*0.1);
				tx = ((Mw/2)-(mrad))+(Math.random()*(mrad*2));
				ty = mrad+Math.floor(Math.random()*(Mh-(mrad*2)));
				pTL.push(['sphere',tx,ty,trad,minh,maxh,hval]);
				
				pTL.push(['RandomizeH',sl+Math.ceil((aHm/lines_A)*(i+1)),aHm*2,sl+Math.ceil((aHm/lines_A)*(i+1)),Math.ceil((aHm/lines_A)*(i+3))]);
				

			}	
			
			

			pTL.push(['RandomizeH',pthis.biomes['Lowlands'][0]-25,pthis.biomes['Lowlands'][0]+25,pthis.biomes['Lowlands'][0]-25,pthis.biomes['Lowlands'][0]+25]);
			
			pTL.push(['Noise',3,-1,aHm*2]);	
			pTL.push(['BlurH',-1,aHm,3]);	
				
			pTL.push(['CutH',0,aHm,100]);	
			pTL.push(['BlurH',0,sl+1,1]);	
				
			
							
			//pTL.push(['BlurH',0,aHm,3]);	
			pTL.push(['genRivers']);		
	
		},
		'New Terra' : function(pthis){
			pthis.map = [];
			var Mw = pthis.mw;
			var Mh = pthis.mh;
			var sMd = Math.min(Mw,Mh);
			var sl = pthis.sealevel;
			var cmap = pthis.map;
			var td = pthis.td;		
			var bw = Math.round(Mw*0.1);
			var bh = Math.round(Mh*0.1);
			var aHm = pthis.absHmax;
			var trad,tx,ty,tl,thm,iq,ran,ax,ay,bx,by;
			var pTL = pthis.FilterList;
				
			pTL.push(['setHto',true,10]);
			var ca = 32;
			for (var i=0;i<ca;i++){
				rad = Math.ceil(sMd*0.05+(Math.random()*(sMd*0.3)));
				tx = (bw+rad) + Math.floor(Math.random()*(Mw-((bw+rad)*2)));
				ty = (bh+rad) + Math.floor(Math.random()*(Mh-((bh+rad)*2)));
				
				pTL.push(['sphere',tx,ty,rad,0,sl*0.5,sl*0.5]);
			}
			
			
			pTL.push(['RanH',30,aHm,25]);
		
			//N-S Valleys
			var va = 4;
			var vf = 6;
			var vt = 5;
			var vti = vt;
			var sh = 100;			
			var lb = Math.floor((Math.random()/2)*100)/100;
			thm = 1;	
			for (var i =0;i<va;i++){
				iq = (i/va);
				bx = Math.floor(Math.random()*((Mw)));
				ax = Math.floor(Math.random()*((Mw)));
				ab = bx-ax;
				for (var j =0;j<vf;j++){
				
					vti = vti + Math.floor(-2+(Math.floor(Math.random()*2)*4));
					if (vti < vt){
						vti = vt;
					}
					if (vti > vt*2) {
						vti = vt*2;
					}
					jq = (j/vf);		
					
					afx = ax;	
					
					bfx = ax + Math.round((((1/vf)*ab)-Math.ceil(sh/2))+Math.floor(Math.random()*(sh)));
					
					//Math.round(((ax)
					
					afy = (Mh*jq);	
					bfy = ((Mh*jq)+((1/vf)*Mh));	
					pTL.push(['line',afx,afy,bfx,bfy,vti,0,aHm*2,thm]);	
					ax = bfx;
				}
			
			}	
				
			//W-E Valleys
			var va = 2;
			var vf = 12;
			var vt = 2;
			var vti = vt;
			var sh = 50;	
			thm = 1;		
			var lb = Math.floor((Math.random()/2)*100)/100;
			for (var i =0;i<va;i++){

				iq = (i/va);
				by = Math.floor(Math.random()*((Mh)));
				ay = Math.floor(Math.random()*((Mh)));
				ab = by-ay;
				for (var j =0;j<vf;j++){
					vti = vti + Math.floor(-2+(Math.floor(Math.random()*2)*4));
					if (vti < vt){
						vti = vt;
					}
					if (vti > vt*2) {
						vti = vt*2;
					}
					jq = (j/vf);		
					
					afy = ay;	
					
					bfy = ay + Math.round((((1/vf)*ab)-Math.ceil(sh/2))+Math.floor(Math.random()*(sh)));
					
					//Math.round(((ax)
					
					afx = (Mw*jq);	
					bfx = ((Mw*jq)+((1/vf)*Mw));	
					pTL.push(['line',afx,afy,bfx,bfy,vti,0,aHm*2,thm]);	
					ay = bfy;
				}
			
			}	
			
			pTL.push(['Noise',3,-1,aHm]);	
			pTL.push(['BlurH',-1,sl,1]);				
			pTL.push(['Noise',3,-1,aHm]);
			
			var mountain_ranges = 8;
			var vf = 10;
			var vt = 5;
			vti = vt;
			var sh = 25;	
			thm = aHm;
			thmi = thm;
			var lb = Math.floor((Math.random()/2)*100)/100;
			for (var i =0;i<mountain_ranges;i++){

				iq = (i/va);
				vt = 2+Math.floor(Math.random()*4);
				by =  Math.round(Math.random()*(Mh));
				ay =  Math.round(Math.random()*(Mh));
				ab = by-ay;
				for (var j =0;j<vf;j++){
					vti = vti + Math.floor(-1+(Math.floor(Math.random()*2)*2));
					if (vti < 1){
						vti = 1;
					}
					if (vti > vt) {
						vti = vt;
					}
					thmi = thmi + (Math.floor(-1+(Math.floor(Math.random()*2)*2))*25);
					if (thmi < sl*2.5){
						thmi = sl*2.5;
					}
					if (thmi > thm) {
						thmi = thm;
					}
					jq = (j/vf);		
					
					afy = ay;	
					
					bfy = ay + Math.round((((1/vf)*ab)-Math.ceil(sh/2))+Math.floor(Math.random()*(sh)));
					
					afx = (Mw*jq);	
					bfx = ((Mw*jq)+((1/vf)*Mw));	
					pTL.push(['line',afx,afy,bfx,bfy,vti,10,aHm,thmi]);	
					ay = bfy;
				}
			
			}	
		
		
			
			pTL.push(['SmoothH',-1,25,1]);	
			pTL.push(['Noise',1,-1,aHm]);
			
				
			var base_circles = 128;
			for (var i=0;i<base_circles;i++){
	
				rad = Math.ceil(sMd*0.05)+Math.floor(Math.random()*(sMd*0.1));		
				tx = Math.round((Mw*0.1))+Math.round(Math.random()*((Mw*0.8)));	
				ty = Math.round((Mh*0.1))+Math.round(Math.random()*((Mh*0.8)));	
			
				thm = rad*3;
				pTL.push(['sphere',tx,ty,rad,10,sl+Math.floor((thm*2)),sl+Math.floor((thm*2)+50)]);
				
				
				
				if(i% Math.ceil(base_circles/4) === 0 && i >1 ){	
					pTL.push(['SmoothH',0,aHm,1]);
				}
				
				if (i == 	Math.floor(base_circles/2)){
					//pTL.push(['moveH',sl,aHm,aHm/4]);	
					pTL.push(['Noise',1,0,aHm]);
					pTL.push(['BlurH',0,aHm,1]);	
				}
				
			}
			
			pTL.push(['BlurH',-1,sl/2,3]);	
			pTL.push(['BlurH',sl/2,aHm,1]);	
			//pTL.push(['RandomizeH',sl+1,aHm,sl+1,150]);	
			pTL.push(['SmoothH',sl+1,aHm,1]);	
			
			var mountain_bases = 32;
			for (var i=0;i<mountain_bases;i++){
				ran = Math.random();
				rad = Math.ceil(sMd*0.05)+Math.floor(ran*(sMd*0.1));		
				tx = Math.round(Math.random()*((Mw)));	
				ty = Math.round(Math.random()*((Mh)));	
			
				thm = Math.ceil(ran*25);
				pTL.push(['sphere',tx,ty,rad,sl,aHm-i,thm]);
			
				if(i% Math.floor(mountain_bases/4) === 0){	
					pTL.push(['Noise',1,sl,aHm-i]);
					
				}
			
			}		
			
			
			pTL.push(['BlurH',sl+5,aHm,1]);	
			pTL.push(['CutH',0,sl,10]);	
			pTL.push(['CutH',sl,aHm,50]);	
		
				pTL.push(['genRivers']);		
			
		
		},	
},
	Filters : 			{
		setHto :			function([pthis,cmap,td,mw,mh,aHm,sl,	israndom,maxh]){
			var hmulti = 1;
			for (var i in cmap){
				if (israndom == true){
					hmulti = Math.random();
				}
				cmap[i].h = Math.floor(hmulti*maxh);
			}
		},
		sphere : 		function([pthis,cmap,td,mw,mh,aHm,sl,	tx,ty,rad,minh,maxh,hval]){  
			

			tx = Math.floor(tx);
			ty = Math.floor(ty);
			mw = Math.floor(mw);
			mh = Math.floor(mh);
			minh = Math.floor(minh);
			maxh = Math.floor(maxh);
			rad = Math.floor(rad);
			
			var th = 0;
			if (rad < 1){
				rad = 1;
			}
			
			var px,py,pid,tid,tdh;
			var points = [];			
		
			points = getPoints(tx,ty,rad);
			
			var plush = 0;
			tid =  ((ty)*mw)+(tx);
			
			for (var i in points){	
				tpi = points[i];
				px = tpi[0];
				py = tpi[1];
				pid = ((py)*mw)+(px);
				if (cmap[pid] != undefined){
					th = cmap[pid].h;	
					if (px > 0 && px < mw-1 && py > 0 && py < mh-1 && th > minh && th < maxh){ 
						
						tdh = tpi[2];	
						
						plush = Math.floor(th)+Math.floor(((rad-(tdh))/(rad))*hval);
						
						if (th+plush < minh){
							plush = 0;
						}
						if(th+plush > maxh){
							plush = maxh;
						}	
					
							cmap[pid].h = plush;	
							cmap[pid].a = 1;	
						
					}
				}
			}
			
			function distance(p1, p2){
				dx = p2.x - p1.x; dx *= dx;
				dy = p2.y - p1.y; dy *= dy;
				return Math.sqrt( dx + dy );
			}
			function getPoints(x, y, r){
				var ret = [];
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (d <= r) {				
							ret.push([j,k,d]);
						}
					}
				}
				return ret;
			}
		
		},
		line :				function([pthis,cmap,td,mw,mh,aHm,sl,	ax,ay,bx,by,linewidth,minh,maxh,hval]){  
					var aid,bid,Ll;
					var Line = [];
					aid = ax + (ay*mw);
					bid = bx + (by*mw);
					Lx = bx-ax;
					Ly = by-ay;
					Ll = Math.sqrt((Lx*Lx)+(Ly*Ly));
					
					for (var i=0;i<Ll;i++){
						
						lpx = Math.floor(ax + (Lx*(i/Ll)));
						lpy = Math.floor(ay + (Ly*(i/Ll)));
						lpid = lpx + (lpy*mw);
						Line.push(lpid);
						nt = getPoints(lpx,lpy,linewidth);
						for (var j in nt){
							nid = nt[j][0]+(nt[j][1]*mw);
							Line.push(nid);
						}
						
					}
					
					
					for (var i in Line){
						tid = Line[i];
						if (cmap[tid] != undefined){
							if (cmap[tid].h > minh && cmap[tid].h < maxh){
								cmap[tid].h = hval;						
								cmap[tid].a = 1;
							}
						}
						
						
					}
			function distance(p1, p2){
				dx = p2.x - p1.x; dx *= dx;
				dy = p2.y - p1.y; dy *= dy;
				return Math.sqrt( dx + dy );
			}
			function getPoints(x, y, r){
				var ret = [];
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (d <= r) {				
							ret.push([j,k,d]);
						}
					}
				}
				return ret;
			}
		
					
		},
		valley :			function([pthis,cmap,td,mw,mh,aHm,sl,	tx,ty,amount,maxLength,maxrad,valley_h,hrange]){
			maxLength = Math.round(maxLength);
			maxrad = Math.round(maxrad/td);
			
			var valleys = [];
			var Mw = mw;
			var Mh = mh;
			
			var tid = 0;
			var randir = 0;
			var randc = 0;
			var rand = 0;
			if (maxrad <= td){
				maxrad = td*2;
			}
			var rant = Math.ceil(maxrad);
			var posA = [];
			
			var tadd = 0;
			
			var vl = maxLength;
			var oldx = -1;
			var oldy = -1;
			for (var i=0;i<amount;i++){
				oldx = tx;
				oldy = ty;
				randir = Math.floor(Math.random()*8);
				rant = Math.floor(Math.random()*1);
				ranc = 0;
				for (var j=0;j<vl;j++){				
					tx = Math.floor(tx);
					ty = Math.floor(ty);		
				
					tid = Math.floor(tx+(ty*Mw));
					valleys.push(tid);
					
					ranc++;
					if (ranc >= rant){
						ranc=0;
						ranDirectionChange = Math.floor(-1+(Math.floor(Math.random()*2)*2))
						randir = randir + ranDirectionChange;
						if (randir < 0){
							randir = 7;
						}
						if (randir > 7){
							randir = 0;
						}
					}
					
					
					
					switch(randir){
						case 0 :{
							tx = tx;
							ty = ty-1;			
							break;
						}
						case 1 :{					
							tx = tx+1;
							ty = ty-1;	
							break;
						}
						case 2 :{					
							tx = tx+1;
							ty = ty;
							break;
						}
						case 3 :{					
							tx = tx+1;
							ty = ty+1;
							break;
						}
						case 4 :{					
							tx = tx;
							ty = ty+1;
							break;
						}
						case 5 :{					
							tx = tx-1;
							ty = ty+1;
							break;
						}
						case 6 :{					
							tx = tx-1;
							ty = ty;
							break;
						}
						case 7 :{					
							tx = tx-1;
							ty = ty-1;
							break;
						}					
					}
					
		
	
					
					if (tx < maxrad || tx > Mw-maxrad || ty < maxrad || ty > Mh-maxrad){
						tx = Math.floor(maxrad + (Math.random()*(Mw-(maxrad*2))));
						ty = Math.floor(maxrad + (Math.random()*(Mh-(maxrad*2))));					
					}
					if (oldx == tx && oldy == ty){
						randir = Math.floor(Math.random()*8);
					}
					
				}			
			}
			var slope = [];
			var points;
			for (var i in valleys){
				if (i < (Mh*Mw)){
				tx = cmap[valleys[i]].pos[0];
				ty = cmap[valleys[i]].pos[1];
				th = cmap[valleys[i]].h;
				if (tx > maxrad+1 && tx < Mw-(maxrad+1) && ty > maxrad+1 && ty < Mh-(maxrad+1)){
					points = [];
					points = getPoints(tx,ty,maxrad);
					for (var j in points){
						px = points[j][0];
						py = points[j][1];		
						if (px > 0 && px < mw && py > 0 && py < mh){ 
							pid = ((py)*mw)+(px);
							
							tdh = cmap[pid].h;
							tdr = points[j][2];	
							if (slope[pid] === undefined){
								slope[pid] = [px,py,tdr];
							}else{
								if (slope[pid][2] >= tdr){
									slope[pid][2] = tdr;								
								}
							
							}
						}
					}
				
				}
				}
			};
			var plush = 0;
			
			for (var i in slope){
			
				px = slope[i][0];
				py = slope[i][1];	
				tdr = slope[i][2];		
				
				pid = i;
				tdh = cmap[pid].h;
									
										
				plush = cmap[pid].h+((maxrad-tdr)/maxrad)*valley_h
	
				if (plush < hrange[0]){
					plush = hrange[0];
				}
				if(plush > hrange[1]){
					plush =  hrange[1];
				}	
				if(tdh >= hrange[0] && tdh <= hrange[1]){ 
					cmap[pid].h = plush;	
					cmap[pid].a = 1;	
				}
				
						
			}
		
			function distance(p1, p2){
				dx = p2.x - p1.x; 
				dx *= dx;
				dy = p2.y - p1.y; 
				dy *= dy;
				return Math.sqrt( dx + dy );
			}
			function getPoints(x, y, r){
				var ret = [];
				var d = 0;
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (d <= r) {				
							ret.push([j,k,d]);
						}
					}
				}
				return ret;
			}
		
			
		},
		Noise : 			function([pthis,cmap,td,mw,mh,aHm,sl,	lits,hmin,hmax]){
		for(var j=0;j<lits;j++){
			var neig,tx,ty,th,nh,rd;
			for (var i in cmap){
				tx = cmap[i].pos[0];
				ty = cmap[i].pos[1];
				th = cmap[i].h;
				if(tx>1&&tx<mw-1&&ty>1&&ty<mh-1&&th>0&&th>hmin&&th<hmax){
					neig = [
					-(mw)-1,-mw,(-mw)+1,
					-1,1,
					mw-1,mw,mw+1			
					];
					rd = parseInt(i)+neig[Math.floor(Math.random()*neig.length)];
					nh = cmap[rd].h;
					if (nh>hmin&&nh<hmax){
						cmap[rd].h = th;
						cmap[i].h = nh;
						cmap[rd].a = 1;
						cmap[i].a = 1;
					}
				}
			}	
		}
	},
		RandomizeH:	function([pthis,cmap,td,mw,mh,aHm,sl,	hmin,hmax,minh,maxh]){
			for (var i in cmap){
				th = cmap[i].h;
				if (th >= hmin && th <= hmax){
					cmap[i].h = minh+Math.round(Math.random()*(maxh-minh));	
					cmap[i].a = 1;
				}
			}	
		},
		RanH:			function([pthis,cmap,td,mw,mh,aHm,sl,	hmin,hmax,hval]){
			for (var i in cmap){
				th = cmap[i].h;
				if (th >= hmin && th <= hmax){
					cmap[i].h = Math.floor((th - hval)+(Math.random()*(hval*2)));
					cmap[i].a = 1;
				}
			}	
		},
		CutH : 			function([pthis,cmap,td,mw,mh,aHm,sl,	hmin,hmax,val]){
			for (var i in cmap){
				th = cmap[i].h;
				if (th < 0){
					cmap[i].h = 0;
				}
				if (th > aHm){
					cmap[i].h = aHm;
				}
				if (th > hmin && th < hmax){
					cmap[i].h = Math.floor(th/val)*val;
				}
				cmap[i].a = 1;
				
			}
		},
		StretchH :		function([pthis,cmap,td,mw,mh,aHm,sl,	hmin,hmax,minh,maxh]){
			var th;
			var mid = Math.round((hmax-hmin)/2);
			var lowH = mid;
			var highH = mid;
			for (var i in cmap){
				th = cmap[i].h;
				if (th > hmin && th < hmax){
					if (th > highH){
						highH = th;
					}
					if (th < lowH){
						lowH = th;
					}				
				}			
			}
			
			for (var i in cmap){
				th = cmap[i].h;
				if (th > hmin && th < hmax){
					cmap[i].h = minh +((th/maxh)*(highH));
				}
			}
		
		},
		SmoothH :		function([pthis,cmap,td,mw,mh,aHm,sl,	hmin,hmax,rad]){
			mw = Math.floor(mw);
			mh = Math.floor(mh);
			hmin = Math.floor(hmin);
			hmax = Math.floor(hmax);
			rad = Math.floor(rad);
			
	

			
			var smMask = [];
			var px,py,pid;
			var points = [];		
			var plush = 0;
			var plusha = 0;
			

			
			for (var i in cmap){		
					cmi = cmap[i];
					th = cmi.h;
					smMask[i] = th;	
				
			}	
			


			for (var i in cmap){
				th = cmap[i].h;	
				tx = Math.floor(cmap[i].pos[0]);
				ty = Math.floor(cmap[i].pos[1]);					
				if (tx > rad && ty > rad && tx < mw-rad && ty < mh-rad && th >= hmin && th <= hmax){	
					points = [];
					points = getPoints(tx,ty,rad);
					plush = 0;
					plusha = 0;
					for (var pi in points){
						px = Math.floor(points[pi][0]);
						py = Math.floor(points[pi][1]);		
						pid = ((py)*mw)+(px);						
						plusha += smMask[pid];
					}	
					plush = Math.round((th+(plusha/points.length))/2);
					
					smMask[i] = plush;
				}
				
				
			}

			for (var i in smMask){
					cmap[i].h = Math.floor(smMask[i]);
					cmap[i].a = 1;
			}

			function distance(p1, p2){
				dx = p2.x - p1.x; dx *= dx;
				dy = p2.y - p1.y; dy *= dy;
				return Math.sqrt( dx + dy );
			}
			function getPoints(x, y, r){
				var ret = [];
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (d <= r) {				
							ret.push([j,k,d]);
						}
					}
				}
				return ret;
			}
			smMask = [];
			points = [];
		
		},
		BlurH :			function([pthis,cmap,td,mw,mh,aHm,sl,	hmin,hmax,rad]){
			mw = Math.floor(mw);
			mh = Math.floor(mh);
			hmin = Math.floor(hmin);
			hmax = Math.floor(hmax);
			rad = Math.floor(rad);
			
		
			
			var smMask = [];
			var px,py,pid;
			var points = [];		
			var plush = 0;
			var plusha = 0;
			
			for (var i in cmap){		
					cmi = cmap[i];
					th = cmi.h;
					smMask[i] = th;	
				
			}			
			var i =0;
			var tloop = function(){
				for (;i<smMask.length;i++){
					th = cmap[i].h;	
					tx = Math.floor(cmap[i].pos[0]);
					ty = Math.floor(cmap[i].pos[1]);					
					if (tx > rad && ty > rad && tx < mw-rad && ty < mh-rad && th >= hmin && th <= hmax){	
						points = [];
						points = getPoints(tx,ty,rad);
						plush = 0;
						plusha = 0;
						for (var pi in points){
							px = Math.floor(points[pi][0]);
							py = Math.floor(points[pi][1]);		
							pid = ((py)*mw)+(px);						
							plusha += smMask[pid];
						}	
						plush = Math.round((plusha/points.length));
						
						smMask[i] = plush;
						
					}
					if (i + 1 < smMask.length && i % smMask.length === 0) {
						setInterval(tloop,0.1);
					}else{
						
					}
				}
			}
			tloop();
			
			for (var i in smMask){
					cmap[i].h = Math.floor(smMask[i]);
					cmap[i].a = 1;
			}
		
			function distance(p1, p2){
				dx = p2.x - p1.x; dx *= dx;
				dy = p2.y - p1.y; dy *= dy;
				return Math.sqrt( dx + dy );
			}
			function getPoints(x, y, r){
				var ret = [];
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (d <= r) {				
							ret.push([j,k,d]);
						}
					}
				}
				return ret;
			}
			smMask = [];
			points = [];
		
		},
		MinMaxH : 	function([pthis,cmap,td,mw,mh,aHm,sl,	minh,maxh]){
			for (var i in cmap){
						td = cmap[i].h;
						cmap[i].h = Math.round((td/100)*maxh);
						cmap[i].a = 1;
			}
		},
		moveH : 		function([pthis,cmap,td,mw,mh,aHm,sl,	hmin,hmax,val]){
			var th;
			for (var i in cmap){
				th = cmap[i].h;
				if (th > hmin && th < hmax){
					cmap[i].h = val;
				}
			}	
		},
		movePlate : 	function([pthis,cmap,td,mw,mh,aHm,sl,	tx,ty,maxrad,movex,movey]){
			if (tx<0){
				tx = 0;
			}			
			if(tx>mw){
				tx = mw-1;
			}
			if (ty<0){
				ty = 0;
			}			
			if(ty>mh){
				ty = mh-1;
			}
			if (maxrad < 1){
				maxrad = 1;
			}
			var sid,tc,ta,tid,nt,nid,pid;
			tc = 0;
			ta = maxrad;
			var plate = [];
			sid = tx+(mw*ty);
			plate.push(sid);
			while(tc<ta){		
				tid = sid;
				nt = getPoints(tx,ty,tc+1);
				for (var j in nt){
					rand = Math.floor(Math.random()*1);
					if (rand == 0){
						nid = nt[j][0]+(nt[j][1]*mw);
						nisp = false;
						neighs = [tid-(mw+1),tid-mw,tid-(mw-1),tid-1,tid+1,tid+(mw-1),tid+mw,tid+(mw+1)];
						for (var k in neighs){							
							neiid = neighs[k];
							for (var l in plate){
								plid = plate[l];
								if (neiid == plid){
									nisp = true;
								}
							}
						}
						if (nisp == false){
							if (nid>=0&&nid<(mw*mh)){
									plate.push(nid);
							}
						}
					}
				}						
				tc++;
			}
			for (var i in plate){
				pid = plate[i];
			
				cmap[pid].h = aHm;
				cmap[pid].a = 1;
			
			}
			function distance(p1, p2){
				dx = p2.x - p1.x; dx *= dx;
				dy = p2.y - p1.y; dy *= dy;
				return Math.sqrt( dx + dy );
			}
			function getPoints(x, y, r){
				var ret = [];
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (Math.round(d) == Math.round(r)) {
							ret.push([j,k,d]);
						}
					}
				}
				return ret;
			}

		},
		genRivers : 	function([pthis,cmap,td,mw,mh,aHm,sl		]){
			var borders = [-(mw+1),-(mw),-(mw-1),(1),(mw+1),(mw),(mw-1),-(1)];
			var river = [];
			// gen Startpool/Coast-Array 
			
			var startpool = [];
			var th;
			for (var i in cmap){
				th = cmap[i].h;
				if (th <= sl){
					for (var j in borders){
						borderid = parseInt(i) + borders[j];
						if (cmap[borderid] != undefined){
							bh = cmap[borderid].h;
							if (bh >=sl){
								startpool.push([i,j]);
							}
						}
					}
				}
			}
			
			// Get random startposition
			if (startpool.length < 1){
				console.log('startpool  is empty');
			}
			var sid = startpool[Math.floor(Math.random()*startpool.length)][0];

			river.push(sid);
			
			var river_l = 0;
			var river_max = 2000;
			var river_kr = 0.000;
			
			nextHighPoint(sid);
			function nextHighPoint(id){
				var tpid;
				var tpool = [];
				var higherTs = [];
				var killRiver = false;
				tr = 5;
				tx = cmap[id].pos[0];
				ty = cmap[id].pos[1];
				th = cmap[id].h;
				tpool = getPoints(tx,ty,tr);
				for (var i in tpool){
					tpid = Math.floor((tpool[i][1])*mw)+tpool[i][0];
					if (cmap[tpid] != undefined){
						tph = cmap[tpid].h;
						if (tph > th){
							th = tph;
							higherTs.push(tpid);
							river_l++;
						}
					}
				
				}
				if (higherTs.length > 0){
					ranht = higherTs[Math.floor(Math.random()*higherTs.length)];
					river.push(ranht);
				}else{
					killRiver = true
				}
				
					var iskilled = Math.floor(Math.random()*1000)/1000;
					var tarh = cmap[ranht].h;
					if (iskilled > river_kr && river_l < river_max && tarh >= sl-1 && tarh < aHm && killRiver != true){
						nextHighPoint(ranht);
					}else{
						calcRiver(river);
					}
				
			}
			
			function calcRiver(tarray){
				var newriver = [];
				var startid,endid,sx,ex,sy,ey,dist,a,b,iid,ix,iy;
				for (var i=0;i<tarray.length-1;i++){
				
					startid = tarray[i];
					newriver.push(startid);
					sy = Math.floor(startid/mw);
					sx = startid - (sy*mw);
					
					endid = tarray[parseInt(i)+1];
					ey = Math.floor(endid/mw);
					ex = endid-(ey*mw);
					
					a = Math.max(sx,ex)-Math.min(sx,ex);
					b = Math.max(sy,ey)-Math.min(sy,ey);
					
					dist = Math.sqrt(((a)*(a))+((b)*(b)));
					
					for (var j=0;j<dist;j++){
						ix = ex + Math.round(((sx-ex)/dist)*j)
						iy = ey + Math.round(((sy-ey)/dist)*j);
						interid = ix + (iy*mw);
						inh = cmap[interid].h;
						if (inh < sl){
							break;
						}else{
							newriver.push(interid);
						}
					}
				
				}
				carveRiver(newriver);
			}
			
			function carveRiver(rarray){
				var rrad,newh;
				for (var i in rarray){
					if (cmap[rarray[i]] == undefined){
						alert(rarray[i]);
					}
					rrad = 6-Math.ceil((5/rarray.length)*i);
					rvalley = getPoints(cmap[rarray[i]].pos[0],cmap[rarray[i]].pos[1],rrad);
					for (var j in rvalley){
						rid = rvalley[j][0]+(rvalley[j][1]*mw);
						if (cmap[rid] != undefined){
							newh = Math.round(pthis.map[rid].h-(((rvalley[j][2])/(rrad))*(pthis.map[rid].h*0.05)));
							if (newh > sl){
								pthis.map[rid].h = newh;
							}
						

						}
						
					}
					pthis.map[rarray[i]].h = 0;//sl+Math.round((pthis.map[rarray[i]].h-sl)*0.1)
				}
			}

			function distance(p1, p2){
				dx = p2.x - p1.x; dx *= dx;
				dy = p2.y - p1.y; dy *= dy;
				return Math.sqrt( dx + dy );
			}
			function getPoints(x, y, r){
				var ret = [];
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (d <= r) {				
							ret.push([j,k,d]);
						}
					}
				}
				return ret;
			}
			
		}
	},
	init: 					function(){
		var pthis = this;
		var cani = this.cani;
		var tFLPn;
		this.initHtml();
		this.setupCanvas(cani);
		
		$('.btn','.Presets').on('click',function(){
			tFLPn = $(this).attr('id');
			pthis.actFilter = tFLPn;
			if (pthis.FLrunning == true){
				pthis.stop(pthis,cani,tFLPn,true);
			}
			
			pthis.start(pthis,pthis.cani,tFLPn);
		});
	},
	start : 				function(pthis,cani,tFLPn){
	
		pthis.FLrunning = true;
		pthis.Fi = 0;
		pthis.FilterList = [];
		pthis.FilterListPresets[tFLPn](pthis);
		pthis.doFilterList(cani,pthis.FilterTime,tFLPn);	
	
	},
	stop :				function(pthis,cani,tFLPn,delFL){
		pthis.FLrunning = false;
		pthis.Fi = 0;
		if (delFL == true){
			pthis.FilterList = [];
		}
	},
	initMapArray:	function(thr){
	
		//Set Variables
	
		var mw = this.mw; 	//Map Width in px
		var mh = this.mh;		//Map Height in px
		var tx = 0;					// x-position for map[i]
		var ty = 0;					// y-position for map[i]
		var index = 0;				// index for map[i]
		var na = mw*mh; 		// Total sum of tiles
		var th = thr; 					// h-value for map[i]
		var tt = this.temperatur[1];
		//initalize this.map-Array
		
		for (var i=0;i<mh;i++){
			for (var j=0;j<mw;j++){
				if (thr[0] == 'random'){
					th = Math.floor(Math.random()*thr[1]);
				}
				this.map[index] = {
					pos : [j,i],
					h : th,
					t : tt,
					a : 1,
					c : null
				};
				index++;
				tx++;
			}
			tx=0;
			ty++;
		}		
	},
	initHtml : 			function(){
		var c = '';
		var pthis = this;
		
		c+='<div class="background"></div>';
		c+='<div class="screen">';
			c+='<div class="panelbar">';
				c+='<div class="handler"></div>';
				c+='<div class="panel File">';
					c+='<div class="btnhead">File</div>';
					c+='<a class="export btn">export</a>';
				
				c+='</div>';
				c+='<div class="panel Presets">';
					c+='<div class="btnhead">Presets</div>';
					for (var i in this.FilterListPresets){
					c+='<div class="btn" id="'+i+'">'+i+'</div>';
					}
				
				c+='</div>';
				
			c+='</div>';
			c+='<div class="can_display">';
				c+= '<div class="candiv">';
				c+='</div>';
			c+='</div>';
				
				
		c+='</div>';
		$('body').html(c);
		
		
		

	},
	setupCanvas : 	function(cani){
		var map_w = this.td * this.mw;
		var map_h = this.td * this.mh;
		var td = this.td;
		var c = '';
	
		c+='<canvas class="can prefin_can" id="mapcan' + cani + '" width="' + map_w + 'px" height ="'+ map_h + '"></canvas>';
		c+='<canvas class="can prefin_can" id="culturescan' + cani + '" width="' + map_w + 'px" height ="'+ map_h + '"></canvas>';

		$('.candiv','.can_display').html(c);
		var can = document.getElementById('mapcan' + cani);
		var ctx = can.getContext("2d");

		var id = ctx.createImageData(1,1); // only do this once per page
		var d  = id.data;		// only do this once per page
		
		var tx = 0;
		var ty = 0;
		var th = 0;
		var tcolor;
		var talpha;
		
		//fill background
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillRect(0,0,map_w,map_h);
		
	},
	doFilterList : 		function(cani,time,FLname){
		var Ffunc,Fvars,Inputvars,c,tF;
		var BaseVars = [this,this.map,this.td,this.mw,this.mh,this.absHmax,this.sealevel];	
		var aHm = this.absHmax;
		var c = '';
		var pthis = this;
		this.initMapArray(1);	
		for (var FLi in pthis.FilterList){
			tF = pthis.FilterList[FLi][0];
			c+='<div class="filter" id="filter'+FLi+'"></div>';
		}
		$('.FilterList','.filterstate_display').html(c);
		function nextFilter(){
			if (pthis.Fi < pthis.FilterList.length){
					$('#filter'+pthis.Fi,'body .filterstate_display .FilterList').toggleClass('active_filter');						
			}		
			setTimeout(function(){
			
						
				if (pthis.Fi < pthis.FilterList.length){
				
					$('.FilterDetails','body .filterstate_display').html(FLname+'<br>'+ pthis.Fi + ' / ' + pthis.FilterList.length + '<br>' + pthis.FilterList[pthis.Fi][0]);
				
					applyFilter(pthis);	
					
					
					if (pthis.PrintAfterFilterapply == true){
						pthis.printResults(cani,false);
					}
					
					pthis.Fi++;
					$('#filter'+(pthis.Fi-1),'body .filterstate_display .FilterList').toggleClass('active_filter').toggleClass('done_filter');					
					nextFilter();
					
				}else{	
					$('.FilterDetails','body .filterstate_display').html(FLname+'<br>'+ pthis.Fi + ' / ' + pthis.FilterList.length);
				
					pthis.FLrunning = false;
					
					for (var mi in pthis.map){
						var th = pthis.map[mi].h;
						if (th < 0){
							th = 0;
						}
						if (th > aHm){
							th = aHm;
						}
						pthis.map[mi].h = th;
					}
					$('#mapcan' + cani,'body').removeClass('prefin_can');
					$('#mapcan' + cani,'body .can_display .candiv').addClass('fin_can');
					pthis.FinnishMapGen();
				}
			}, time);
		};
		nextFilter();	
		function applyFilter(pthis){	
			Ffunc =	pthis.Filters[pthis.FilterList[pthis.Fi][0]];
			Inputvars = pthis.FilterList[pthis.Fi].slice(1, pthis.FilterList[pthis.Fi].length);
			Fvars = [];
			for (var j in BaseVars){
				Fvars.push(BaseVars[j]);
			}
			for (var j in Inputvars){
				Fvars.push(Inputvars[j]);
			}
			
				Ffunc(Fvars);
	
		}		
	},
	printResults:		function(cani,printAll){
		
		var map_w = this.td * this.mw;
		var map_h = this.td * this.mh;
		var td = this.td;
		var aHm = this.absHmax;
	
		var fillPixel;
	
		var can = document.getElementById('mapcan'+cani);
		if (can != null){
			var ctx = can.getContext("2d");

			var id = ctx.createImageData(1,1); // only do this once per page
			var d  = id.data;		// only do this once per page
			
			var tx = 0;
			var ty = 0;
			var th = 0;
			var tcolor = [0,0,0];
			var talpha;
			if (printAll == true){
				ctx.fillStyle = 'rgba(0,0,0,1)';
				ctx.fillRect(0,0,map_w,map_h);
			}

			for (var i in this.map){
				ta = this.map[i].a;
				if (printAll == true){
					ta = 1;
				}
				if (ta == 1){
					tx = Math.floor(this.map[i].pos[0]*this.td);
					ty = Math.floor(this.map[i].pos[1]*this.td);		
					th = Math.floor(this.map[i].h);
					
					if (th >= aHm){
						th = aHm-1;
					}
					if (th < 0){
						th = 0;
					}
					tcolor = [255,0,0];
					talpha = 1;
					
					if(this.colormap == true){				
						for (var bi in this.biomes){				
							if (th < this.biomes[bi][1] && th >= this.biomes[bi][0]){
								tc = this.biomes[bi][2];
								tarc = this.biomes[bi][3];
								for (var ci=0;ci<3;ci++){
									tcolor[ci] = Math.round(tc[ci]+((th-this.biomes[bi][0])/(this.biomes[bi][1]-this.biomes[bi][0]))*(tarc[ci]-tc[ci]));
								}
							}
											
						}
						if (th > aHm){
							tcolor = [0,255,255];
							talpha = 1;
						}							
					}else{
						talpha = th/aHm;
						ta = Math.floor(255-(talpha*255));
						tcolor = [ta,ta,ta];
						talpha = 1;						
					}
					
					ctx.fillStyle = 'rgba(' + tcolor + ',' + talpha + ')';
					if (tx > this.td*2 && ty > this.td*2 && tx < map_w-(this.td*3) && ty < map_h-(this.td*3)){
						
						
							ctx.fillRect(tx,ty,td,td);		
						
						
						
														
					}
					this.map[i].a = 0;
				}
			};

			}
		
	},
	drawCultures: 	function(){
		var map_w = this.td * this.mw;
		var map_h = this.td * this.mh;
		var td = this.td;
		var aHm = this.absHmax;

			var can = document.getElementById('culturescan0');
			if (can != null){
			var ctx = can.getContext("2d");

			var id = ctx.createImageData(1,1); // only do this once per page
			var d  = id.data;		// only do this once per page
			ctx.clearRect(0, 0, map_w, map_h);
			for (var i in this.cultures){
				ctx.fillStyle = 'rgba(255,0,0,1)';
				if (i==0){
				ctx.fillStyle = 'rgba(255,0,255,1)';
				}
				if (i==1){
				ctx.fillStyle = 'rgba(255,255,0,1)';
				}
				if (i==2){
				ctx.fillStyle = 'rgba(255,0,0,1)';
				}
				for (var j in this.cultures[i]){
					tid = this.cultures[i][j];
					ty = Math.floor(tid/this.mw);
					tx = tid - (ty*this.mw);
					ctx.fillRect(tx*td,ty*td,td,td);		
				}
			}
			}

	},
	FinnishMapGen:function(){
		this.cleanMap();
		//this.initHumanity();
		
		
		var pthis = this;
		pthis.printResults(pthis.cani,true);
	
		var canvas = document.getElementById('mapcan0');
		var img    = canvas.toDataURL("image/png"); 
		
		var imgname = 'GenExport_' + Math.floor(Math.random()*10) + '' + Math.floor(Math.random()*10) + '' + Math.floor(Math.random()*10) + '' + Math.floor(Math.random()*10) + '.png'; 
		
		$('.export','.screen .panelbar .File').attr('download',imgname);
		$('.export','.screen .panelbar .File').attr('href',img);
			
		
			
		
		

	},
	cleanMap:			function(){
		for (var i in this.map){
			tx = this.map[i].pos[0];
			ty = this.map[i].pos[1];
			th = this.map[i].h;
			if (th > 1000){
				this.map[i].h = 1000;
			}
			if (tx < 2 || tx > this.mw-3 || ty < 2 || ty > this.mh-3){
				this.map[i].h = 0;
			}
		}
	},
	initHumanity: 	function(){
		var mw = this.mw
		var land = [];
		var th= 0;
		var td = this.td;
		for (var i in this.map){
			th = this.map[i].h;
			if (th > this.sealevel){
				land.push(i);
			}
		}
		//start cultures
		var cultures_a = 3;
		for (var i=0;i<cultures_a;i++){
			ranid= land[Math.floor(Math.random()*(land.length))];
			this.cultures[i] = [ranid];		
			this.map[ranid].c = i;
		}
		//grow cultures
		pthis = this;

		var tid,tx,ty,ntx,nty,ntid,nope,bid;
		var max_lits = 3;
		var lit = 0;
		var bordering = [];
		var borders = [
		-(mw+1),-mw,-(mw-1),
		-1,1,
		(mw-1),mw,mw+1
		];
	
		intsLoop(lit);
		function intsLoop(lit){		
			for (var i in pthis.cultures){
				bs = [];
				for (var j in pthis.cultures[i]){
					bs[j] = pthis.cultures[i][j];
				}
				
				for (var bi in bs){
					tid = parseInt(bs[bi]);
					for (var j in borders){
						bid = tid + borders[j]; 
						isgood = false;
						if (pthis.map[bid].c === null){
							isgood = true;
						}
						if (pthis.map[bid].h < pthis.sealevel || pthis.map[bid].h > 1000){
							isgood = false;
						}
						if (isgood == false){
							bs.splice(tid,1);
						}						
					}				
				}
				
				for (var bi in bs){
				rbid = bs[bi];
				
				ry = Math.floor(rbid/mw);
				rx = rbid-(ry*mw);
			
				rrad = 3;
				grt = getPoints(rx,ry,rrad,false);
				
				for (var j in grt){
					gid = Math.floor(grt[j][0])+(Math.floor(grt[j][1])*pthis.mw);
				
					if (pthis.map[gid] != undefined){
						isgood = true;
						th = pthis.map[gid].h;
						if (th < pthis.sealevel || th > 750){
							isgood = false;
						}
						for (var k in pthis.cultures[i]){
							kid = pthis.cultures[i][k];
							if (kid == gid){
								isgood = false;
							}					
						}
						if (pthis.map[gid].c != null){
							isgood = false;
						}
						if (isgood == true){
							pthis.cultures[i].push(gid);
							pthis.map[gid].c = i;
						}
					}else{
						
					}
				}
				}
			}			
			pthis.drawCultures();				
			setTimeout(function(){
				lit++;
				if (lit < max_lits){
					intsLoop(lit);				
				}			
			},1);	
			
		}

		function distance(p1, p2){
				dx = p2.x - p1.x; dx *= dx;
				dy = p2.y - p1.y; dy *= dy;
				return Math.sqrt( dx + dy );
			}
		function getPoints(x, y, r,borders){
				var ret = [];
				for (var j=x-r; j<=x+r; j++){
					for (var k=y-r; k<=y+r; k++){
						d = distance({x:j,y:k},{x:x,y:y});
						if (borders === false){
							if ((d) <= (r)) {				
								ret.push([j,k,d]);
							}
						}else{
							if (Math.round(d) == Math.round(r)) {				
								ret.push([j,k,d]);
							}
						
						}
					}
				}
				return ret;
			}
		
		//this.drawCultures();
		//console.log('doine');
	}
}.init();
