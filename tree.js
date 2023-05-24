
//unique values by class
function listUniqueValuesByClass(className) {
  var matchList = [];
  const matches = document.getElementsByClassName(className);
  for (let i = 0; i < matches.length; i++) {
    matchList.push(matches[i].value);
  };
  return [... new Set(matchList)];
};

//get the max value to increment by 1 for index
function getMaxByPattern(inputArray, pattern) {
  const patternMatches = inputArray.filter(x => x.startsWith(pattern)).map(y => parseInt(y.replace(pattern, '')));
  var maxMatch = 0;
  patternMatches.forEach((x) => {
    if (x > maxMatch) {
      maxMatch = x;
    };
  });
  return maxMatch;
};

function updateEdges() {
  const currentNodeNumbers = listUniqueValuesByClass('node_number');
//  $('#ctn_edges .edge').each(function() {
  $('.edge').each(function() {
    const edgeFrom = $(this).children('.edge_from').val();
    const edgeTo = $(this).children('.edge_to').val()
    if (currentNodeNumbers.includes(edgeFrom) && currentNodeNumbers.includes(edgeTo)) {
    } else {
      $(this).remove();
    };
  });
};

function findToNodeNumbers(inputFrom) {
  var outputTo = [];
//  $('#ctn_edges .edge').each(function() {
  $('.edge').each(function() {    
    const edgeFrom = $(this).children('.edge_from').val();
    const edgeTo = $(this).children('.edge_to').val()
    if (edgeFrom == inputFrom) {
      outputTo.push(edgeTo);
    };
  });
  return outputTo;
};

function removeNode(nodeToRemove) {
  $('#ctn_nodes .node').each(function() {
      const nodeNumber = $(this).children('.node_number').val();
      if (nodeToRemove == nodeNumber) {
        $(this).remove();
      };
    });
};

$(function() {
  //jquery methods go here

  $('.graph_layout').select2();
  $('.graph_rankdir').select2();

  //basic controls
  //add node
  $('#btn_add_node').click(function() {
    var node = document.createElement('form');
    node.classList.add('node');

    var nodeName = document.createElement('input');
    nodeName.classList.add('node_name');
    nodeName.setAttribute('type', 'text');
    var nodeIndex = getMaxByPattern(listUniqueValuesByClass('node_number'), '') + 1 ;
//    nodeName.setAttribute('value', 'node' + nodeIndex.toString());
    nodeName.setAttribute('placeholder', 'node' + nodeIndex.toString());


    var nodeNumber = document.createElement('input');
    nodeNumber.classList.add('node_number');
    nodeNumber.setAttribute('type', 'hidden');
    nodeNumber.setAttribute('value', nodeIndex.toString());

    var nodeColor = document.createElement('select');
    nodeColor.classList.add('node_color');
    nodeColor.setAttribute('single', 'single');

    var nodeShape = document.createElement('select');
    nodeShape.classList.add('node_shape');
    nodeShape.setAttribute('single', 'single');

    var btnAddNode = document.createElement('button');
    btnAddNode.classList.add('btn_add_node');
    btnAddNode.setAttribute('type', 'button');
    btnAddNode.innerText = 'add edge';

    var btnRemoveNode = document.createElement('button'); //button
    btnRemoveNode.setAttribute('type', 'button');
    btnRemoveNode.innerText = 'remove node';
    btnRemoveNode.setAttribute('onclick', 'this.parentNode.remove(); updateEdges()');

    var btnRemoveDownstream = document.createElement('button');
    btnRemoveDownstream.classList.add('btn_remove_downstream');
    btnRemoveDownstream.setAttribute('type', 'button');
    btnRemoveDownstream.innerText = 'remove downstream';

    node.appendChild(nodeName);
    node.appendChild(nodeNumber);
    node.appendChild(nodeColor);
    node.appendChild(nodeShape);
    node.appendChild(btnAddNode);
    node.appendChild(btnRemoveNode);
    node.appendChild(btnRemoveDownstream);

    document.getElementById('ctn_nodes').appendChild(node);
    $('#ctn_nodes .node .node_color').last().select2();
    $('#ctn_nodes .node .node_shape').last().select2();

    updateColorOptions();
    updateShapeOptions();

    $('#ctn_nodes .node .btn_add_node').last().click(function() {
      const fromNodeNumber = $(this).closest('.node').children('.node_number').val();
      addNodeEdge(fromNodeNumber);
    });

    $('#ctn_nodes .node .btn_remove_downstream').last().click(function() {
      removeDownstreamEdges($(this));
    });

  });

  //adds updated options to last node_color selector
  function updateColorOptions() {
    colorList.forEach((x, i) => {
      if (i == 0) {
        var newOption = new Option(x, i, false, true);
      } else {
        var newOption = new Option(x, i, false, false);
      };
      $('#ctn_nodes .node .node_color').last().append(newOption).trigger('change');
    });
  };

  //adds updated options to last type node_shape selector
  function updateShapeOptions() {
    shapeList.forEach((x, i) => {
      if (i == 0) {
        var newOption = new Option(x, i, false, true);
      } else {
        var newOption = new Option(x, i, false, false);
      };
      $('#ctn_nodes .node .node_shape').last().append(newOption).trigger('change');
    });
  };

  function addNodeEdge(fromNodeNumber) {
    $('#btn_add_node').trigger('click');
    const toNodeNumber = $('#ctn_nodes .node .node_number').last().val();
    //const toNode = $('#ctn_nodes .node').last();
    //alert(toNode);

    var edge = document.createElement('div');
    edge.classList.add('edge');
//    edge.setAttribute('type', 'hidden');

    var edgeLabel = document.createElement('input');
    edgeLabel.classList.add('edge_label');
    edgeLabel.setAttribute('type', 'text');
    edgeLabel.setAttribute('placeholder', 'edge label to node' + toNodeNumber);
    edgeLabel.setAttribute('value', '');

    var edgeStyle = document.createElement('select');
    edgeStyle.classList.add('edge_style');
    edgeStyle.setAttribute('single', 'single');

    var edgeDirection = document.createElement('select');
    edgeDirection.classList.add('edge_direction');
    edgeDirection.setAttribute('single', 'single');

    var edgeFrom = document.createElement('input');
    edgeFrom.classList.add('edge_from');
    edgeFrom.setAttribute('value',fromNodeNumber);
    edgeFrom.setAttribute('type', 'hidden');

    var edgeTo = document.createElement('input');
    edgeTo.classList.add('edge_to');
    edgeTo.setAttribute('value', toNodeNumber);
    edgeTo.setAttribute('type', 'hidden');


    edge.appendChild(edgeLabel);
    edge.appendChild(edgeStyle);
    edge.appendChild(edgeDirection);
    edge.appendChild(edgeFrom);
    edge.appendChild(edgeTo);
    var lastNode = Array.from(document.querySelectorAll('.node')).pop();
    lastNode.appendChild(edge);

    $('.edge .edge_style').last().select2();
    $('.edge .edge_direction').last().select2();

    updateStyleOptions();
    updateDirectionOptions();

  };

  //adds updated options to last edge_style selector
  function updateStyleOptions() {
    styleList.forEach((x, i) => {
      if (i == 0) {
        var newOption = new Option(x, i, false, true);
      } else {
        var newOption = new Option(x, i, false, false);
      };
      $('.edge .edge_style').last().append(newOption).trigger('change');
    });
  };

  //adds updated options to last edge_direction selector
  function updateDirectionOptions() {
    directionList.forEach((x, i) => {
      if (i == 0) {
        var newOption = new Option(x, i, false, true);
      } else {
        var newOption = new Option(x, i, false, false);
      };
      $('.edge .edge_direction').last().append(newOption).trigger('change');
    });
  };

  function removeDownstreamEdges(input) {
    const downstreamRoot = input.closest('.node').children('.node_number').val();
    recursiveRemoveDownstream(downstreamRoot);
    updateEdges();
  };

  function recursiveRemoveDownstream(inputRoot) {
    const downstreamNodes = findToNodeNumbers(inputRoot);
    if (downstreamNodes.length == 0) {
    } else {
      downstreamNodes.forEach( r => {
        recursiveRemoveDownstream(r);
        removeNode(r);
      });
    };
  };

  $('#btn_reset').click(function() {
    $('#ctn_nodes .node').remove();
    updateEdges();
    $("#btn_add_node").trigger("click");
    refreshTree();
  });

  //this adds the first node
  $("#btn_add_node").trigger("click");
});