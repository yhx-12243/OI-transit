#!/usr/bin/env python3

try:
	while True:
		s = input()
		t = ''
		for c in s:
			if ord(c) > 256:
				t += '&#' + str(ord(c)) + ';'
			else:
				t += c
		print(t)
except (EOFError, KeyboardInterrupt):
	pass

