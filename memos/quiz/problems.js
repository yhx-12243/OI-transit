const problem_list = [
		{ // 1
			'lang' : 'C++11',
			'code' : '// Beginner Level, print the right answer below !\n#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint x = 10;\n\tcout << x++ << \'\\n\';\n\tcout << ++x << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '10\n12\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '解析：入门，了解前置自增运算符和后置自增运算符的区别。'
		},
		{ // 2
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint x = 10;\n\tcout << sizeof(x++) << \'\\n\';\n\tcout << ++x << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '4\n11\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '解析：<code>sizeof</code> 是<strong>不求值表达式</strong>，因此第一个 <code>x++</code> 不会对变量 <code>x</code> 产生副作用。\n在<strong>几乎所有</strong>的现代计算机中，<code>int</code> 包含 4 个字节。'
		},
		{ // 3
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << ((1 + 2) << 3) << \'\\n\';\n\tcout << (1 + (2 << 3)) << \'\\n\';\n\tcout << (1 + 2 << 3) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '24\n17\n24\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '解析：左移运算符 (<code>&lt;&lt;</code>) 的优先级<strong>严格低于<strong>加法运算符 (<code>+</code>)。'
		},
		{ // 4
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << std::boolalpha; // output boolean as \'true\' or \'false\'\n\tcout << ((0 == 1) <= 2) << \'\\n\';\n\tcout << (0 == (1 <= 2)) << \'\\n\';\n\tcout << (0 == 1 <= 2) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : 'true\nfalse\nfalse\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '解析：等号/不等号运算符 (<code>=</code>/<code>!=</code>) 的优先级<strong>严格低于<strong>偏序比较运算符 (<code>&lt;</code>/<code>&gt;</code>/<code>&lt;=</code>/<code>&gt;=</code>)。'
		},
		{ // 5
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a[2] = {3, 4};\n\tcout << 10**a << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '30\n',
			'ub' : false,
			'ce' : false,
			'explanation' : 'C++ 没有求幂 (<code>**</code>) 运算符，故 <code>a**b</code> 解析为 <code>a * (*b)</code>。'
		},
		{ // 6
			'lang' : 'C++11',
			'code' : '<span class="sh_preproc">#include</span> <span class="sh_string">&lt;bits/stdc++.h&gt;</span>\n<span class="sh_keyword">using</span> std<span class="sh_symbol">::</span>cin<span class="sh_symbol">;</span>\n<span class="sh_keyword">using</span> std<span class="sh_symbol">::</span>cout<span class="sh_symbol">;</span>\n\n<span class="sh_type">int</span> <span class="sh_function">main</span><span class="sh_symbol">()</span> <span class="sh_cbracket">{</span>\n\t<span class="sh_type">int</span> a<span class="sh_symbol">[</span><span class="sh_number">2</span><span class="sh_symbol">]</span> <span class="sh_symbol">=</span> <span class="sh_cbracket">{</span><span class="sh_number">3</span><span class="sh_symbol">,</span> <span class="sh_number">4</span><span class="sh_cbracket">}</span><span class="sh_symbol">;</span>\n\tcout <span class="sh_symbol">&lt;&lt;</span> <span class="sh_number">10</span><span class="sh_symbol">/*</span>a <span class="sh_symbol">&lt;&lt;</span> <span class="sh_string">\'</span><span class="sh_specialchar">\\n</span><span class="sh_string">\'</span><span class="sh_symbol">;</span>\n\t<span class="sh_keyword">return</span> <span class="sh_number">0</span><span class="sh_symbol">;</span>\n<span class="sh_cbracket">}</span>\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'html' : true,
			'explanation' : '编译时，注释 (<code>/*</code>) 替换先于运算符的解析。'
		},
		{ // 7
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << (1 ? 2 : 3 ? 4 : 5) << \'\\n\';\n\tcout << (0 ? 1 : 2 ? 3 : 4) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '2\n3\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '三目运算符是右结合的。'
		},
		{ // 8
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a, b, c, d;\n\n\ta = 1, b = 2, c = 3;\n\t(a ? b : c) = 4;\n\tcout << a << \' \' << b << \' \' << c << \'\\n\';\n\n\ta = 1, b = 2, c = 3;\n\ta ? b : (c = 4);\n\tcout << a << \' \' << b << \' \' << c << \'\\n\';\n\n\ta = 1, b = 2, c = 3;\n\ta ? b : c = 4;\n\tcout << a << \' \' << b << \' \' << c << \'\\n\';\n\n\ta = 1, b = 2, c = 3, d = 4;\n\t(d = a) ? b : c;\n\tcout << d << \'\\n\';\n\n\ta = 1, b = 2, c = 3, d = 4;\n\td = (a ? b : c);\n\tcout << d << \'\\n\';\n\n\ta = 1, b = 2, c = 3, d = 4;\n\td = a ? b : c;\n\tcout << d << \'\\n\';\n\n\treturn 0;\n}\n',
			'answer' : '1 4 3\n1 2 3\n1 2 3\n1\n2\n2\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '在 C++ 中，三目运算符和赋值运算符具有相同的优先级，且右结合。'
		},
		{ // 9
			'lang' : 'C',
			'code' : '// note following program will be regarded as C.\n#include <stdio.h>\n\nint main() {\n\tint a = 1, b = 2, c = 3;\n\t(a ? b : c) = 4;\n\tprintf("%d %d %d\\n", a, b, c);\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '在 C 中，三目运算符从不返回左值。'
		},
		{ // 10
			'lang' : 'C',
			'code' : '// note following program will be regarded as C.\n#include <stdio.h>\n\nint main() {\n\tint a = 1, b = 2, c = 3;\n\ta ? b : (c = 4);\n\tprintf("%d %d %d\\n", a, b, c);\n\treturn 0;\n}\n',
			'answer' : '1 2 3\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '略。'
		},
		{ // 11
			'lang' : 'C',
			'code' : '// note following program will be regarded as C.\n#include <stdio.h>\n\nint main() {\n\tint a = 1, b = 2, c = 3;\n\ta ? b : c = 4;\n\tprintf("%d %d %d\\n", a, b, c);\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '在 C 中，三目运算符的优先级<strong>严格高于</strong>赋值运算符，故此题同 #9。'
		},
		{ // 12
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tstd::vector <std::set <int>> foo;\n\tcout << foo.size() << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '0\n',
			'ub' : false,
			'ce' : false,
			'explanation' : 'vector 等容器在作为局部变量时默认调用构造函数。'
		},
		{ // 13
			'lang' : 'C++03',
			'code' : '// note following program will be regarded as C++03.\n#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tstd::vector <std::set <int>> foo;\n\tcout << foo.size() << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : 'C++11 前模板定义不能使用 <code>&gt;&gt;</code>，需添加空格。'
		},
		{ // 14
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\ntypedef std::string foo;\n\nnamespace test {\n\ttypedef int foo;\n\tstd::vector <foo> bar;\n}\n\nint main() {\n\ttest::bar.resize(1);\n\tcout << \'[\' << test::bar.back() << \']\' << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '[0]\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '命名空间 <code>test</code> 中会使用 <code>test</code> 中的 <code>foo</code>，即 <code>int</code>。'
		},
		{ // 15
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\ntypedef std::string foo;\n\nnamespace test {\n\ttypedef int foo;\n\tstd::vector <::foo> bar;\n}\n\nint main() {\n\ttest::bar.resize(1);\n\tcout << \'[\' << test::bar.back() << \']\' << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '[]\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<code>::</code> 前缀表示无名空间，即外部的 <code>std::string</code>。'
		},
		{ // 16
			'lang' : 'C++03',
			'code' : '// note following program will be regarded as C++03.\n#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\ntypedef std::string foo;\n\nnamespace test {\n\ttypedef int foo;\n\tstd::vector <::foo> bar;\n}\n\nint main() {\n\ttest::bar.resize(1);\n\tcout << \'[\' << test::bar.back() << \']\' << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : 'C++11 前，<code>&lt;:</code> 被强制分析为 <code>[</code> 的代用记号，故上述程序无法成功编译。'
		},
		{ // 17
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tstd::string s = "Room \\x35G";\n\tcout << s << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : 'Room 5G\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '十六进制转义序列 <code>\\x35</code> 表示字符 <code>\'5\'</code>。'
		},
		{ // 18
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tstd::string s = "Room \\x35F";\n\tcout << s << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '<code>\'F\'</code> 是合法十六进制数位，这会到导致十六进制转义序列超限而无法编译。'
		},
		{ // 19
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << sizeof(-2147483648) << \'\\n\'; // 2147483648 = 2^31\n\treturn 0;\n}\n',
			'answer' : '8\n',
			'ub' : false,
			'ce' : false,
			'explanation' : 'C++ 中没有负整数常量，<code>-2147483648</code> 表示对 <code>2147483648</code> 取负。而 <code>2147483648</code> 无法用 <code>int</code> 表示。'
		},
		{ // 20
			'lang' : 'C++11',
			'code' : '<span class="sh_preproc">#include</span> <span class="sh_string">&lt;bits/stdc++.h&gt;</span>\n<span class="sh_keyword">using</span> std<span class="sh_symbol">::</span>cin<span class="sh_symbol">;</span>\n<span class="sh_keyword">using</span> std<span class="sh_symbol">::</span>cout<span class="sh_symbol">;</span>\n\n<span class="sh_type">int</span> <span class="sh_function">main</span><span class="sh_symbol">()</span> <span class="sh_cbracket">{</span>\n\tcout <span class="sh_symbol">&lt;&lt;</span> <span class="sh_number">0xffLl</span> <span class="sh_symbol">&lt;&lt;</span> <span class="sh_string">\'</span><span class="sh_specialchar">\\n</span><span class="sh_string">\'</span><span class="sh_symbol">;</span>\n\t<span class="sh_keyword">return</span> <span class="sh_number">0</span><span class="sh_symbol">;</span>\n<span class="sh_cbracket">}</span>\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'html' : true,
			'explanation' : '“长长后缀” 要么使用 <code>ll</code>，要么使用 <code>LL</code>，大小写不能混用。'
		},
		{ // 21
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << 0xFfll << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '255\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '在 “长长后缀” 前面的数值部分可以大小写混用。'
		},
		{ // 22
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << 0xff+2 << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '257\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '255 + 2 = 257。'
		},
		{ // 23
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << 0xee+2 << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '以 <code>e</code> 或 <code>E</code> 结束的十六进制常量在后面<strong>紧跟</strong> <code>+</code> 或 <code>-</code> 时，编译器会贪心认为其实浮点数而报错。'
		},
		{ // 24
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 100, b = 10;\n\tcout << a - b << \'\\n\';\n\tcout << a << \' \' << b << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '90\n100 10\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '略。'
		},
		{ // 25
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 100, b = 10;\n\tcout << a -- b << \'\\n\';\n\tcout << a << \' \' << b << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '一对孤立的 <code>--</code> 在一起时总是会被认为是自减运算符。'
		},
		{ // 26
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 100, b = 10;\n\tcout << a - - b << \'\\n\';\n\tcout << a << \' \' << b << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '110\n100 10\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '通过加空格可以避免错误解析；一元运算符具有较高的优先级。'
		},
		{ // 27
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 100, b = 10;\n\tcout << a --- b << \'\\n\';\n\tcout << a << \' \' << b << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '90\n99 10\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '贪心的编译器总会将完整的 <code>--</code> 给左边 (<code>a</code>)，故 <code>a --- b</code> 解析为 <code>(a--) - b</code>。'
		},
		{ // 28
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 100, b = 10;\n\tcout << a ---- b << \'\\n\';\n\tcout << a << \' \' << b << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '<code>a----</code> 被解析为 <code>( (a--) -- )</code>，而后置自减运算符返回右值，故无法对其再自减。'
		},
		{ // 29
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint n = 10;\n\tn = (++n) + (n++) + (++n) + (n++);\n\tcout << n << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Undefined Behavior>',
			'ub' : true,
			'ce' : false,
			'explanation' : '经典的 UB，不同的编译器会返回各种各样的结果。'
		},
		{ // 30
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint n = 10;\n\tn = ++n + 5;\n\tcout << n << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '16\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '在 C++11 中，<code>++n</code> 中对 <code>n</code> 的副作用<em>按顺序早于</em>对 <code>n</code> 的值计算，而对 <code>n</code> 的值计算<em>按顺序早于</em>赋值操作。'
		},
		{ // 31
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint n = 10;\n\tn = n++ + 5;\n\tcout << n << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Undefined Behavior>',
			'ub' : true,
			'ce' : false,
			'explanation' : '在 C++11 中，<code>n++</code> 中对 <code>n</code> 的值计算<em>按顺序早于</em>对 <code>n</code> 的副作用，也<em>按顺序早于</em>赋值操作，但对 <code>n</code> 的副作用和赋值操作是<em>无顺序</em>的。'
		},
		{ // 32
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint f(int x, int y) {\n\tcout << x << \' \' << y << \'\\n\';\n}\n\nint main() {\n\tint n;\n\tf(n = 1, n = 2);\n\treturn 0;\n}\n',
			'answer' : '<Undefined Behavior>',
			'ub' : true,
			'ce' : false,
			'explanation' : '函数各参数的求值是<em>顺序不确定</em>的。'
		},
		{ // 33
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nbool gt(unsigned int x) {return x + 1u > x;}\n\nint main() {\n\tcout << std::boolalpha << gt(UINT_MAX) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : 'false\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<code>UINT_MAX + 1</code> 会导致 <code>int</code> 溢出 (俗称 “爆 <code>int</code>”)，因此结果会舍去最高位，变为 0。'
		},
		{ // 34
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nbool gt(int x) {return x + 1 > x;}\n\nint main() {\n\tcout << std::boolalpha << gt(INT_MAX) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Undefined Behavior>',
			'ub' : true,
			'ce' : false,
			'explanation' : '有符号整数溢出是 UB。'
		},
		{ // 35
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << (1 << 32) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '<Undefined Behavior>',
			'ub' : true,
			'ce' : false,
			'explanation' : '移位数量大于位长为 UB。'
		},
		{ // 36
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << (-1 << 2) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '-4\n',
			'ub' : true,
			'ce' : false,
			'explanation' : '左移一个负数是 UB。'
		},
		{ // 37
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << (-17 >> 2) << \'\\n\';\n\treturn 0;\n}\n',
			'answer' : '-5\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '右移负数不是 UB，是向上取整 (算术右移)。'
		},
		{ // 38
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << "Date: ??/??/??\\n";\n\treturn 0;\n}\n',
			'answer' : 'Date: \\??\n',
			'ub' : false,
			'ce' : false,
			'explanation' : 'C++17 前，<code>??/</code> 被视作 <code>\\</code> 的 “三标符”；转义序列 <code>\\\\</code> 表示单个反斜杠 <code>\\</code>。'
		},
		{ // 39
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << "ASP: <% %>\\n";\n\treturn 0;\n}\n',
			'answer' : 'ASP: <% %>\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '“代用记号” (双标符) 的替换在处理注释和字符串之后。'
		},
		{ // 40
			'lang' : 'C++11',
			'code' : '// If this program won\'t halt, just leave blank.\n#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\n// is_prime(x) return true iff x is a prime number.\ninline bool is_prime(unsigned int x) {\n\tunsigned int i;\n\tif (x < 2) return false;\n\tfor (i = 2; (unsigned long long)i * i <= x; ++i)\n\t\tif (x % i == 0) return false;\n\treturn true;\n}\n \nbool test() {\n\tunsigned int i, n; bool found;\n\tfor (n = 0; ; n += 2) {\n\t\tif (n == 0) n = 4;\n\t\tfound = false;\n\t\tfor (i = 1; i < n; ++i) {\n\t\t\tif (is_prime(i) && is_prime(n - i)) {\n\t\t\t\tfound = true;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tif (!found) return false;\n\t}\n\treturn true;\n}\n\nint main() {\n\tcout << std::boolalpha << test() << \'\\n\';\n\treturn 0;\n}',
			'answer' : '<Undefined Behavior>',
			'ub' : true,
			'ce' : false,
			'explanation' : '<strong>无副作用的无限循环</strong>是 UB。'
		},
		{ // 41
			'lang' : 'C++11',
			'code' : '// If this program won\'t halt, just leave blank.\n#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\n// is_prime(x) return true iff x is a prime number.\ninline bool is_prime(unsigned int x) {\n\tunsigned int i;\n\tif (x < 2) return false;\n\tfor (i = 2; (unsigned long long)i * i <= x; ++i)\n\t\tif (x % i == 0) return false;\n\treturn true;\n}\n \nunsigned int test() {\n\tunsigned int i, n; bool found;\n\tfor (n = 0; ; n += 2) {\n\t\tif (n == 0) n = 4;\n\t\tfound = false;\n\t\tfor (i = 1; i < n; ++i) {\n\t\t\tif (is_prime(i) && is_prime(n - i)) {\n\t\t\t\tfound = true;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tif (!found) return n;\n\t}\n\treturn 0;\n}\n\nint main() {\n\tcout << test() << \'\\n\';\n\treturn 0;\n}',
			'answer' : '\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '该无限循环有副作用 (返回 <code>n</code>)，故不是 UB；Goldbach 猜想在 2<sup>64</sup> 范围内成立。'
		},
		{ // 42
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\n#define mmin(a, b) ((a) < (b) ? (a) : (b))\nusing std::cin;\nusing std::cout;\n\ninline int fmin(int a, int b) {return a < b ? a : b;}\n\nint foo = 0, goo = 10;\n\nint bar() {return ++foo;}\nint car() {return ++goo;}\n\nint main() {\n\tcout << mmin(bar(), car()) << \'\\n\';\n\tcout << fmin(bar(), car()) << \'\\n\';\n\treturn 0;\n}',
			'answer' : '2\n3\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '#define 是简单的字符替换，因此该宏会展开为 <code>((bar()) &lt; (car()) ? (bar()) : (car()))</code>，不难得知此时函数 <code>bar()</code> 会被调用两次。而函数即使是 <code>inline</code>，也不会多次调用 <code>bar()</code>。'
		},
		{ // 43
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\n#define print(x) cout << #x << \'\\n\';\n#define foo bar\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tprint(foo);\n\treturn 0;\n}',
			'answer' : 'foo\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<code>#</code> 运算符会立即将形参转化为字符串常量。'
		},
		{ // 44
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\n#define print(x) cout << #x << \'\\n\';\n#define PRINT(x) print(x)\n#define foo bar\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tPRINT(foo);\n\treturn 0;\n}',
			'answer' : 'bar\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<code>PRINT</code> 宏起到一个缓冲作用，使得调用 <code>print</code> 宏时的参数变成了 <code>bar</code>。'
		},
		{ // 45
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 1, b = 2, c = 3;\n#define a b\n#define b c\n\tcout << a << \' \' << b << \' \' << c << \'\\n\';\n\treturn 0;\n}',
			'answer' : '3 3 3\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '宏替换会连续应用，直到找不到对应的宏为止。'
		},
		{ // 46
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 1, b = 2, c = 3;\n#define a b\n#define b c\n#define c a\n\tcout << a << \' \' << b << \' \' << c << \'\\n\';\n\treturn 0;\n}',
			'answer' : '1 2 3\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<strong>递归替换抑制</strong>规则表明，如果在应用宏替换时遇到当前宏名，则会返回第一次进入该宏名时的结果。'
		},
		{ // 47
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a = 1, b = 2, c = 3;\n#define a b\n#define b c\n#define c d\n#define d b\n\tcout << a << \' \' << b << \' \' << c << \' \' << d << \'\\n\';\n\treturn 0;\n}',
			'answer' : '2 2 3 4\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '标识符 <code>a</code> 的替换轨迹为 <code>a</code> → <code>b</code> → <code>c</code> → <code>d</code> → <code>b</code>，在第二次替换到 <code>b</code> 时应用<strong>递归替换抑制</strong>规则，故 <code>a</code> 的最终结果是 <code>b</code> 而不是 <code>a</code>。'
		},
		{ // 48
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\n#define concat(a, b) a##b\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint x = concat(233, 666);\n\tcout << x + 1 << \'\\n\';\n\treturn 0;\n}',
			'answer' : '233667\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '宏运算符 <code>##</code> 用于拼接参数。'
		},
		{ // 49
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\n#define concat(a, b) a##b\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint x = concat(233, 666);\n\tx concat(+, =) 5;\n\tcout << x << \'\\n\';\n\treturn 0;\n}',
			'answer' : '233671\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<code>##</code> 可以将 <code>+</code> 和 <code>=</code> 拼接成 <code>+=</code>。'
		},
		{ // 50
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\n#define concat(a, b) a##b\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tconcat(/, *)\n\tcout << "Hello\\n";\n\tconcat(*, /)\n\tcout << "World\\n";\n\treturn 0;\n}',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '<code>##</code> 不能用于拼接注释。'
		},
		{ // 51
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\n#define concat(a, b) a##b\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint a[2] = {3, 4};\n\tcout << 10 concat(*, *) a << \'\\n\';\n\treturn 0;\n}',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '<code>##</code> 拼接<em>运算符</em>时，只有它们能组成一个<strong>完整的运算符</strong>时，该替换才能进行。而 <code>a**b</code> 解析为 <code>a * (*b)</code>，在这里 <code>**</code> 不是一个完整的运算符。'
		},
		{ // 52
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tcout << __LINE__ << \'\\n\';\n\treturn 0;\n}',
			'answer' : '6\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '特殊宏 <code>__LINE__</code> 返回当前行号。'
		},
		{ // 53
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n#line 50\n\tcout << __LINE__ << \'\\n\';\n\treturn 0;\n}',
			'answer' : '50\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '“行号” 可以通过 <code>#line</code> 指令更改。'
		},
		{ // 54
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n#line 050\n\tcout << __LINE__ << \' \' << 050 << \'\\n\';\n\treturn 0;\n}',
			'answer' : '50 40\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '“行号” <strong>始终解析</strong>为十进制。'
		},
		{ // 55
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint i = 1, sum = 0;\n\tdo {\n\t\tsum += i;\n\t\t++i;\n\t\tif (i <= 100)\n\t\t\tcontinue;\n\t} while (false);\n\tcout << sum << \'\\n\';\n\treturn 0;\n}',
			'answer' : '1\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<code>continue</code> 的功能是跳转到<strong>循环体末尾</strong>而不是第二次循环的开头。'
		},
		{ // 56
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint n = 2;\n\tswitch (n) {\n\t\tint x;\n\t\tcase 1: {\n\t\t\tx = 5;\n\t\t\tcout << x << \'\\n\';\n\t\t\tbreak;\n\t\t}\n\t\tcase 2: {\n\t\t\tx = 10;\n\t\t\tcout << x << \'\\n\';\n\t\t\tbreak;\n\t\t}\n\t}\n\treturn 0;\n}',
			'answer' : '10\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<code>switch</code> 块内可以定义变量。'
		},
		{ // 57
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint n = 2;\n\tswitch (n) {\n\t\tint x = 0;\n\t\tcase 1: {\n\t\t\tx = 5;\n\t\t\tcout << x << \'\\n\';\n\t\t\tbreak;\n\t\t}\n\t\tcase 2: {\n\t\t\tx = 10;\n\t\t\tcout << x << \'\\n\';\n\t\t\tbreak;\n\t\t}\n\t}\n\treturn 0;\n}',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '<code>switch</code> 的本质是标签跳转 (<code>goto</code>)，而标签跳转不允许<strong>交叉初始化</strong> (cross initialization)，除非进入作用域的所有变量声明时不带初始化器和构造/析构函数。'
		},
		{ // 58
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint i, a[5] = {4, 2, 5, 3, 1};\n\tsort(a, a + 5);\n\tfor (i = 0; i < 5; ++i) cout << a[i] << (i == 4 ? \'\\n\' : \' \');\n\treturn 0;\n}',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : '无限定查找不会找到命名空间 <code>std</code> 中的 <code>sort</code> 函数。'
		},
		{ // 59
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint i, a[5] = {4, 2, 5, 3, 1};\n\tsort(a, a + 5, std::greater <int> ());\n\tfor (i = 0; i < 5; ++i) cout << a[i] << (i == 4 ? \'\\n\' : \' \');\n\treturn 0;\n}',
			'answer' : '5 4 3 2 1\n',
			'ub' : false,
			'ce' : false,
			'explanation' : '<strong>ADL 法则</strong> <del>(阿毒瘤法则)</del> <strong>(实参依赖查找)</strong> 可以找到实参 <code>std::greater</code> 所在的命名空间 <code>std</code> 中的 <code>sort</code> 函数。'
		},
		{ // 60
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint i, a[5] = {4, 2, 5, 3, 1};\n\tstd::sort(a, a + 5, greater <int> ());\n\tfor (i = 0; i < 5; ++i) cout << a[i] << (i == 4 ? \'\\n\' : \' \');\n\treturn 0;\n}',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : 'ADL 法则全称<strong>实参依赖查找</strong>，参数的命名空间不会在通过函数名进行查找。'
		},
/*		{ // 61
			'lang' : 'C++11',
			'code' : '#include <bits/stdc++.h>\nusing std::cin;\nusing std::cout;\n\nint main() {\n\tint i, a[5] = {4, 2, 5, 3, 1};\n\t(sort)(a, a + 5, std::greater <int> ());\n\tfor (i = 0; i < 5; ++i) cout << a[i] << (i == 4 ? \'\\n\' : \' \');\n\treturn 0;\n}',
			'answer' : '<Compile Error>',
			'ub' : false,
			'ce' : true,
			'explanation' : 'ADL 法则要求表达式必须为<strong>简单函数调用表达式</strong>。'
		} */
	];
