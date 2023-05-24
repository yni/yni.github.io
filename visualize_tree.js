/*
https://quickchart.io/documentation/graphviz-api/
https://quickchart.io/graphviz?graph=digraph{...}
*/

const colorList = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const shapeList = ['rectangle', 'diamond', 'oval', 'pentagon', 'hexagon', 'Msquare', 'Mdiamond', 'Mcircle'];
const styleList = ['solid', 'dashed', 'dotted', 'bold'];
const directionList = ['forward', 'back', 'both', 'none'];


function refreshTree() {
	var imgUrl = document.getElementById('tree_output');
	var nodeScript = '';
	var edgeScript = '';
	var selectedLayout = $('#layout').find(':selected').val();
	var selectedRankdir = $('#rankdir').find(':selected').val();

	var graphScript = 'layout = "' + selectedLayout + '"; rankdir = "' + selectedRankdir + '";';

	function addNodes() {
		$('#ctn_nodes .node').each(function() {
			var nodeNumber = $(this).children('.node_number').val();
			var nodeName = $(this).children('.node_name').val();
			var nodeColor = $(this).children('.node_color').val();
			var nodeShape = $(this).children('.node_shape').val();
			nodeScript = nodeScript + ' ' + nodeNumber + '[label="' + nodeName + '", color = "' + colorList[nodeColor] +  '", shape="' + shapeList[nodeShape] + '"]; ';
  		});
	};

	function addEdges() {
//		$('#ctn_edges .edge').each(function() {
		$('.edge').each(function() {
			var edgeFrom = $(this).children('.edge_from').val();
			var edgeTo = $(this).children('.edge_to').val();
			var edgeLabel = $(this).children('.edge_label').val();
			var edgeStyle = $(this).children('.edge_style').val();
			var edgeDirection = $(this).children('.edge_direction').val();
			edgeScript = edgeScript + ' ' + edgeFrom + ' -> ' + edgeTo + ' [label = "' + edgeLabel + '", style = "' + styleList[edgeStyle] +'", dir = "' + directionList[edgeDirection] + '"]; ';
  		});
	};


	addNodes();
	addEdges();

 	imgUrl.src = 'https://quickchart.io/graphviz?graph=digraph{ ' + graphScript + nodeScript + edgeScript + '}';
 	var editorUrl = 'https://dreampuf.github.io/GraphvizOnline/#digraph{ ' + graphScript + nodeScript + edgeScript + '}';
 	var graphvizLink = document.getElementById('graphviz_online');
 	graphvizLink.setAttribute("href", editorUrl);
};