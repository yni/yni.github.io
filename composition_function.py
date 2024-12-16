def dictionaryAPlusB(dict_a, dict_b):
	return({i: dict_a.get(i, 0) + dict_b.get(i, 0) for i in set(list(dict_a.keys()) + list(dict_b.keys()))})

def dictionaryAMinusB(dict_a, dict_b):
	output = dict(dict_a)
	for k, v in dict_b.items():
		if v < 0:
			return({})
		elif v > 0:
			if dict_a.get(k, 0) >= v:
				output[k] = dict_a.get(k, 0) - v
			else:
				return({})
	return(output)

def dictionaryAContainsB(dict_a, dict_b):
	for k, v in dict_b.items():
		if v > 0 and dict_a.get(k, 0) < v:
			return(False)
		if v < 0:
			return()
	return(True)

def dictionaryAPlusListB(dict_a, list_b):
	return([dictionaryAPlusB(dict_a, each_dict) for each_dict in list_b])


sample_deck = {
	'gate': 3,
	'kepler': 3,
	'gryphon': 3,
	'cope': 3,
	'swirl': 3,
	'lamia': 1,
	'thomas': 1,
	'rage': 1,
	'cerberus': 1,
	'orthros': 1,
	'ragnarok': 1,
	'necro': 1,
	'typhon': 1,
	'swamp king': 1,
	'typhon': 1,
	'headhunt': 1,
	'throne': 3,
	'terraforming': 1,
	'techs': 11
}

def calculateProbability(dict_hand, dict_deck, total_hand_size):
	def recursion(existing_dict, remaining, current_position):
		if remaining <= 0: # Add to compositions once nothing remains.
			matching_tuple = (0,) * dict_deck_size
			for k, v in existing_dict:
				matching_tuple[dict_deck_index[k]] = v
				compositions.append(matching_tuple)
			return
		elif remaining > 0 and current_position < 0: # Terminate early if checked all possible cards but still have remaining.
			return
		else: # Else, choose a step size and then go to the next card.
			current_key = eligible_keys[current_position]
			current_value = deck[current_key]
			max_step = (remaining if remaining < current_value else current_value)
			for step in range(max_step + 1):
				if step == 0: # When not adding the card, don't bother adding a zero entry into the existing dictionary.
					recursion(existing_dict, remaining - step, current_position - 1)
				else: # When adding a card, merge two dictionaries with current_key at the chosen step size.
					recursion(dictionaryAPlusB({current_key: step}, existing_dict), remaining - step, current_position - 1)
	# This is the master dictionary used to translate dictionaries into hashable tuples.
	dict_deck_size = len(dict_deck)
	dict_deck_index = dict(zip(dict_deck.keys(), list(range(dict_deck_size))))
	deck = dictionaryAMinusB(dict_deck, dict_hand)
	additional_cards = total_hand_size - sum([v for k, v in dict_hand.items()])
	eligible_keys = [k for k, v in deck.items() if v > 0]
	starting_position = len(eligible_keys) - 1
	compositions = []
	recursion(dict_hand, additional_cards, starting_position)
	return(compositions)







def recursion(existing_dict, remaining, current_position):
	if remaining <= 0:
		compositions.append(existing_dict)
		return
	elif remaining > 0 and current_position < 0:
		return
	else:
		current_key = eligible_keys[current_position]
		current_value = deck[current_key]
		max_step = (remaining if remaining < current_value else current_value)
		for step in range(max_step + 1):
			if step == 0:
				recursion(existing_dict, remaining - step, current_position - 1)
			else:
				recursion(dictionaryAPlusB({current_key: step}, existing_dict), remaining - step, current_position - 1)

def generateCompositions(input_dictionary, output_size):


# Identify keys with non-zero values
eligible_keys = [k for k, v in deck.items() if v > 0]

def recursion(remaining, current):
	# most simple base case, remaining is now zero so return empty dictionary
	if remaining <= 0:
		return([{}])
	# 1st base case. Run out of keys.
	elif current >= len(eligible_keys):
		print('run out of keys', remaining, current)
		return([])
	current_key = eligible_keys[current]
	current_value = deck[current_key]
	print(current_key, current_value)
	# 2nd base case, Remaining is greater than current value.
	if remaining > current_value:
		print('remaining is greater than current value', remianing, current)
		return([])
	else:
		max_step = remaining if remaining < current_value else current_value
		print('do recursion')
		return([ {current_key: current_value} | y for y in recursion(remaining - x, current + 1) for x in range(max_step + 1)])

recursion(3, 0)

	
	print(eligible_keys[current])
	print(deck[eligible_keys[current]])
	print(max_step)