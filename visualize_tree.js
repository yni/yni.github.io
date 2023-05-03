/*
https://quickchart.io/documentation/graphviz-api/
https://quickchart.io/graphviz?graph=digraph{...}
*/

const colorList = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const shapeList = ['square', 'diamond', 'circle', 'pentagon', 'hexagon', 'Msquare', 'Mdiamond', 'Mcircle'];

function refreshTree() {
	var imgUrl = document.getElementById('tree_output');
	var nodeScript = '';
	var edgeScript = '';

	function addNodes() {
		$('#ctn_nodes .node').each(function() {
			var nodeNumber = $(this).children('.node_number').val();
			var nodeName = $(this).children('.node_name').val();
			var nodeColor = $(this).children('.node_color').val();
			var nodeShape = $(this).children('.node_shape').val();
			nodeScript = nodeScript + ' ' + nodeNumber + '[label="' + nodeName + '", color = "' + colorList[nodeColor]+  '", shape="' + shapeList[nodeShape] + '"]; ';
  		});
	};

	function addEdges() {
		$('#ctn_edges .edge').each(function() {
			var edgeFrom = $(this).children('.edge_from').val();
			var edgeTo = $(this).children('.edge_to').val();
			edgeScript = edgeScript + ' ' + edgeFrom + ' -> ' + edgeTo + '; ';
  		});
	};


	addNodes();
	addEdges();

 	imgUrl.src = 'https://quickchart.io/graphviz?graph=digraph{ ' + nodeScript + edgeScript + '}';
};