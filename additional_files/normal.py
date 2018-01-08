#!/usr/bin/env python3.5

try:
	while True:
		s = input()
		t = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
		print(t)
except EOFError:
	pass

