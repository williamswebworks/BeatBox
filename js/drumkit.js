//--Start Initialisation

var channel_max = 16;										// number of channels
audiochannels = new Array();
for (a=0;a<channel_max;a++) 
{																			// prepare the channels
	audiochannels[a] = new Array();
	audiochannels[a]['channel'] = new Audio();						// create a new audio object
	audiochannels[a]['finished'] = -1;							// expected end time for this channel
}
		
drumTracks = new Array();
for (t=0;t<=5;t++) 
{	
	drumTracks[t] = new Array();
	for (b=0;b<=15;b++) 
	{	
		drumTracks[t][b] = 0;
	}
}
		
drumSounds = new Array('wav0', 'wav1', 'wav2', 'wav3', 'wav4');

var isPlaying = false;
var hasPlayedOnce = false;
var isLooping = false;
var currentBar = 0;
var stepTime = 125;

var brushVelocity = 0.5

var padSelect = 0;

//--End Initialisation
		
function play_sound(s, v) 
{
	for (a=0;a<audiochannels.length;a++) 
	{
		thistime = new Date();
		if (audiochannels[a]['finished'] < thistime.getTime()) 
		{			// is this channel finished?
			audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
			audiochannels[a]['channel'].src = document.getElementById(s).src;
			audiochannels[a]['channel'].load();
			audiochannels[a]['channel'].volume = v;
			audiochannels[a]['channel'].play();
			break;
		}
	}
}

//--Start control functions

function start_Playing()
{
	isPlaying = true;
	
	if (isLooping == false)
	{
		if (currentBar == 0)
		{
			play_Loop();
		}
		else
		{
			var wait = ((15-currentBar) * 250);
			setTimeout('play_Loop();',wait); 
		}
	}
	
	if (hasPlayedOnce == false && isLooping == true)
	{
		hasPlayedOnce = true;
		play_Loop();
	}
	
	$('#stopButton').attr('enabled','true');
	$('#startButton').attr('enabled','false');
	$('#startButton').attr('class','button startOn');
}
		
function stop_Playing()
{
	isPlaying = false;
	$('#stopButton').attr('enabled','false');
	$('#startButton').attr('enabled','true');
	$('#startButton').attr('class','button startOff');
}
		
function loop_Toggle()
{
	if (isLooping == true) 
	{
		isLooping = false;
		$('#loopButton').attr('class','button loopOff');
	}
	else 
	{ 
		isLooping = true; 
		$('#loopButton').attr('class','button loopOn');
	}
}

//--End control functions
		
function play_Loop()
{
	play_Bar(0);
	setTimeout('play_Bar(1);',(stepTime));
	setTimeout('play_Bar(2);',(stepTime*2));
	setTimeout('play_Bar(3);',(stepTime*3));
	setTimeout('play_Bar(4);',(stepTime*4));
	setTimeout('play_Bar(5);',(stepTime*5));
	setTimeout('play_Bar(6);',(stepTime*6));
	setTimeout('play_Bar(7);',(stepTime*7));
	setTimeout('play_Bar(8);',(stepTime*8));
	setTimeout('play_Bar(9);',(stepTime*9));
	setTimeout('play_Bar(10);',(stepTime*10));
	setTimeout('play_Bar(11);',(stepTime*11));
	setTimeout('play_Bar(12);',(stepTime*12));
	setTimeout('play_Bar(13);',(stepTime*13));
	setTimeout('play_Bar(14);',(stepTime*14));
	setTimeout('play_Bar(15);',(stepTime*15));
	if (isLooping == true) {setTimeout('play_Loop();',(stepTime*16));}
}
		
function play_Bar(bar)
{
	//for every track
	for (d=0;d<=5;d++) 
	{
		//-- set cell display colours, selected cells are left red
		var lastBar = 0;	// find the last bar
		if (bar == 0)
		{ 
			lastBar = 15
		}
		else 
		{ 
			lastBar = bar-1
		}
		if (drumTracks[d][lastBar] == 0)	//if the last bar on the track is set to off, change to white
		{
			$('#' + d +'_' + lastBar).attr('class','unSelectedBar');
		}	
		if (isPlaying == true) 
		{
			if (drumTracks[d][bar] == 0) //if the current bar on the track is set to off, change to green
			{
				$('#' + d +'_' + bar).attr('class','currentBar');
			}
		//-- end colour display
		//-- If the cell is on, play the sound
			if (drumTracks[d][bar] > 0)
			{
				pad_Hit(d, drumTracks[d][bar])
			}
		}
	}
	if (isLooping == false && bar == 15)
	{
		$('#startButton').attr('class','button startOff');
	}
	
	if (bar == 15)
	{
		currentBar = 0;
	}
	else
	{
		currentBar++;
	}
}
		
function pad_Hit(sound, volume)
{
	play_sound(drumSounds[sound], volume);
	$('#pad' + sound).css('background-color', getVolumeColour(volume));
	$('#pad' + sound).animate({ backgroundColor: "#2A2A2A" }, stepTime);
}
		
function select_Cell(selectedCell)
{
	var drumTrack = selectedCell.substr(0,1);
	var drumBar = selectedCell.substr(2);

	if (drumTracks[drumTrack][drumBar] > 0)
	{
		$('#' + selectedCell).attr('class','unSelectedBar');
		drumTracks[drumTrack][drumBar] = 0.0;
	}
	else
	{
		$('#' + selectedCell).attr('class','selectedBar' + (brushVelocity * 10));
		drumTracks[drumTrack][drumBar] = brushVelocity;
	}
}

//Slider functions

function updateStep()
{
	var bpm = $('#bpmSlider').slider( "option", "value" );
	stepTime = ((60/bpm)/4)*1000;
	updateBpmDisplay();
	$('#bpmDisplay').css('color','#FFFFFF');
}

function updateBpmDisplay()
{
	var bpm = $('#bpmSlider').slider( "option", "value" );
	$('#bpmDisplay').html('BPM: ' + bpm);
	$('#bpmDisplay').css('color','#FF6B00');
}

function updateBrushVelocity()
{
	var controlValue = $('#velocitySlider').slider( "option", "value" );
	brushVelocity = controlValue/10;
	$('#matrix').attr('class','velocity' + controlValue);
	$('#kitBox').attr('class','velocity' + controlValue);
	updateVelocityDisplay();
	$('#velocityDisplay').css('color','#FFFFFF');
}

function updateVelocityDisplay()
{
	var controlValue = $('#velocitySlider').slider( "option", "value" );
	$('#velocityDisplay').html('Velocity: ' + controlValue/10);
	$('#velocityDisplay').css('color',getVolumeColour(controlValue/10));
}

//File functions

function dropIt(e, pad) {  
   soundSelected(e.dataTransfer.files, pad); 
   e.stopPropagation();  
   e.preventDefault();   
} 

function soundSelected(myFiles, pad) 
{
	padSelect = pad;
	for (var i = 0, f; f = myFiles[i]; i++) 
	{
		var soundReader = new FileReader();
		soundReader.onload = (function(aFile) 
		{
			return function(e) 
			{
				$('#wav' + padSelect).attr('src', e.target.result);
				$('#sampleSelector' + padSelect).html(aFile.name);
			};
		})(f);
		soundReader.readAsDataURL(f);
	}
}

function getVolumeColour(volume)
{
	switch (volume)
	{
		case 0.1:
		return '#FFFF00';
		break;
		case 0.2:
		return '#FFD000';
		break;
		case 0.3:
		return '#FFB400';
		break;
		case 0.4:
		return '#FF9400';
		break;
		case 0.5:
		return '#FF7D00';
		break;
		case 0.6:
		return '#FF6700';
		break;
		case 0.7:
		return '#FF4F00';
		break;
		case 0.8:
		return '#FF3300';
		break;
		case 0.9:
		return '#FF1B00';
		break;
		case 1:
		return '#FF0400';
		break;
		default:
		return '#FF6B00';
	}
}