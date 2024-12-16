def recursion(remaining, current):
	# most simple base case, remaining is now zero so return empty dictionary
	if remaining <= 0:
		print('remaining <= 0')
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
		print('remaining is greater than current value', remaining, current)
		return([])
	else:
		max_step = remaining if remaining < current_value else current_value
		print(max_step)
		print('do recursion')
		print(remaining)
		return([ {current_key: x} | y for y in recursion(remaining - x, current + 1) for x in range(max_step + 1)])


def flatten_extend(matrix):
    flat_list = []
    for row in matrix:
        flat_list.extend(row)
    return flat_list


def recursion(remaining, current):
	print('new step')
	print(remaining, current)
	# most simple base case, remaining is now zero so return empty dictionary
	if remaining <= 0:
		print('remaining <= 0')
		return(0)
	# 1st base case. Run out of keys.
	elif current >= len(eligible_keys):
		print('run out of keys', remaining, current)
		return()
	current_key = eligible_keys[current]
	current_value = deck[current_key]
	print(current_key, current_value)
	max_step = (remaining if remaining < current_value else current_value)
	print(max_step)
	print('do recursion')
	print(remaining)
	return([recursion(remaining -x, current + 1) for x in range(max_step + 1)])
