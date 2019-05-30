#ifndef __DECIMAL_HEADER_INCLUDED__
#define __DECIMAL_HEADER_INCLUDED__

#include <cstdlib>
#include <cstring>
#include <climits>
#include <string>
#include <vector>
using std::string;

typedef std::vector <int> vector;

class Decimal {
	public:
		static const int BASE = 1000000000;
		static const long long BASE2 = (long long)BASE * BASE;

		Decimal ();
		Decimal (const string &s);
		Decimal (const char *s);
		Decimal (int x);
		Decimal (long long x);
		Decimal (const Decimal &b);
		Decimal (const vector &digits, bool is_negative = false);

		bool is_zero() const;
		string to_string() const;
		int to_int() const;
		long long to_long_long() const;
		int compare_with(const Decimal &b) const;
		int compare_with(int x) const;
		int compare_with(long long x) const;

		Decimal & operator = (const string &s);
		Decimal & operator = (const char *s);
		Decimal & operator = (int x);
		Decimal & operator = (long long x);
		Decimal & operator = (const Decimal &b);

		friend Decimal operator + (const Decimal &a, const Decimal &b);
		friend Decimal operator + (const Decimal &a, int x);
		friend Decimal operator + (int x, const Decimal &a);
		friend Decimal operator + (const Decimal &a, long long x);
		friend Decimal operator + (long long x, const Decimal &a);

		friend Decimal operator - (const Decimal &a, const Decimal &b);
		friend Decimal operator - (const Decimal &a, int x);
		friend Decimal operator - (int x, const Decimal &a);
		friend Decimal operator - (const Decimal &a, long long x);
		friend Decimal operator - (long long x, const Decimal &a);

		friend Decimal operator * (const Decimal &a, const Decimal &b);
		friend Decimal operator * (const Decimal &a, int x);
		friend Decimal operator * (int x, const Decimal &a);

		friend Decimal operator / (const Decimal &a, const Decimal &b);
		friend Decimal operator / (const Decimal &a, int x);

		friend Decimal operator % (const Decimal &a, const Decimal &b);
		friend Decimal operator % (const Decimal &a, int x);

		friend bool operator < (const Decimal &a, const Decimal &b);
		friend bool operator < (const Decimal &a, int x);
		friend bool operator < (int x, const Decimal &b);
		friend bool operator < (const Decimal &a, long long x);
		friend bool operator < (long long x, const Decimal &b);

		friend bool operator > (const Decimal &a, const Decimal &b);
		friend bool operator > (const Decimal &a, int x);
		friend bool operator > (int x, const Decimal &b);
		friend bool operator > (const Decimal &a, long long x);
		friend bool operator > (long long x, const Decimal &b);

		friend bool operator <= (const Decimal &a, const Decimal &b);
		friend bool operator <= (const Decimal &a, int x);
		friend bool operator <= (int x, const Decimal &b);
		friend bool operator <= (const Decimal &a, long long x);
		friend bool operator <= (long long x, const Decimal &b);

		friend bool operator >= (const Decimal &a, const Decimal &b);
		friend bool operator >= (const Decimal &a, int x);
		friend bool operator >= (int x, const Decimal &b);
		friend bool operator >= (const Decimal &a, long long x);
		friend bool operator >= (long long x, const Decimal &b);

		friend bool operator == (const Decimal &a, const Decimal &b);
		friend bool operator == (const Decimal &a, int x);
		friend bool operator == (int x, const Decimal &b);
		friend bool operator == (const Decimal &a, long long x);
		friend bool operator == (long long x, const Decimal &b);

		friend bool operator != (const Decimal &a, const Decimal &b);
		friend bool operator != (const Decimal &a, int x);
		friend bool operator != (int x, const Decimal &b);
		friend bool operator != (const Decimal &a, long long x);
		friend bool operator != (long long x, const Decimal &b);

		Decimal & operator += (int x);
		Decimal & operator += (long long x);
		Decimal & operator += (const Decimal &b);

		Decimal & operator -= (int x);
		Decimal & operator -= (long long x);
		Decimal & operator -= (const Decimal &b);

		Decimal & operator *= (int x);
		Decimal & operator *= (const Decimal &b);

		Decimal & operator /= (int x);
		Decimal & operator /= (const Decimal &b);

		Decimal & operator %= (int x);
		Decimal & operator %= (const Decimal &b);

		Decimal & abs();
		Decimal & neg();
		friend Decimal operator - (const Decimal &a);

		friend std::istream & operator >> (std::istream &in, Decimal &b);
		friend std::ostream & operator << (std::ostream &out, const Decimal &b);

		explicit operator int () {return this->to_int();}
		explicit operator long long () {return this->to_long_long();}
		operator void* () {return this->is_zero() ? 0 : this;}
	private:
		static void append_to_string(std::string &s, long long x);

		bool is_neg;
		vector s;
		
		void init();
		void initstr(const char *str);
		Decimal & canonicity();
		friend int __builtin_simple_division(const Decimal &a, const Decimal &b);
};

void Decimal::init() {is_neg = false, s.clear(), s.push_back(0);}

void Decimal::initstr(const char *str) {
	this->init();

	int L = strlen(str);
	if (*str == 45) is_neg = true, ++str, --L;
	if (!L || (L == 1 && *str == 48)) {is_neg = false; return;}

	int i; char tok[10]; tok[9] = 0;
	s.clear();

	for (i = 1; i * 9 <= L; ++i) {
		memcpy(tok, str + (L - i * 9), 9); 
		s.push_back((int)strtol(tok, NULL, 10));
	}

	if (L % 9) {
		memcpy(tok, str, L % 9), tok[L % 9] = 0;
		s.push_back((int)strtol(tok, NULL, 10));
	}

	this->canonicity();
}

Decimal & Decimal::canonicity() {
	for (; s.size() > 1 && !s.back(); s.pop_back());
	if (this->is_zero()) is_neg = false;
	return *this;
}

Decimal::Decimal () {this->init();}

Decimal::Decimal (const string &s) {this->initstr(s.c_str());}
	
Decimal::Decimal (const char *s) {this->initstr(s);}

Decimal::Decimal (int x) {
	this->init(), x < 0 && (is_neg = true, x = -x), s.back() = x % BASE;
	if (x >= BASE) s.push_back(x / BASE);
}

Decimal::Decimal (long long x) {
	this->init(), x < 0 && (is_neg = true, x = -x), s.back() = x % BASE;
	if (x >= BASE) s.push_back(x / BASE % BASE);
	if (x >= BASE2) s.push_back(x / BASE2);
}

Decimal::Decimal (const Decimal &b) {is_neg = b.is_neg, s = b.s;}

Decimal::Decimal (const vector &digits, bool is_negative) {is_neg = is_negative, s = digits, this->canonicity();}

bool Decimal::is_zero() const {return s.size() == 1 && s.back() == 0;}

string Decimal::to_string() const {
	string ret;
	if (is_neg && !this->is_zero()) ret.push_back(45);

	int i = (int)s.size() - 1; char tok[10];
	for (sprintf(tok, "%d", s[i]); ret += tok, i--; sprintf(tok, "%09d", s[i]));

	return ret;
}

int Decimal::to_int() const {
	long long v = this->to_long_long();
	return v >= INT_MAX ? INT_MAX : v <= INT_MIN ? INT_MIN : (int)v;
}

long long Decimal::to_long_long() const {
	unsigned long long v = 0;
	switch (s.size()) {
		case 3u : if (s[2] > 9) return is_neg ? LLONG_MIN : LLONG_MAX; v += s[2] * BASE2;
		case 2u : v += (long long)s[1] * BASE;
		case 1u : v += s[0]; break;
		default : return is_neg ? LLONG_MIN : LLONG_MAX;
	}
	return is_neg ? (v > LLONG_MAX ? LLONG_MIN : -(long long)v) : (v >= LLONG_MAX ? (long long)LLONG_MAX : (long long)v);
}

int Decimal::compare_with(const Decimal &b) const {
	if (is_neg != b.is_neg) return is_neg;
	if (s.size() != b.s.size()) return (s.size() < b.s.size()) ^ is_neg ? -1 : 1;
	for (int i = (int)s.size() - 1; i >= 0; --i)
		if (s[i] != b.s[i]) return (s[i] < b.s[i]) ^ is_neg ? -1 : 1;
	return 0;
}

int Decimal::compare_with(int x) const {return this->compare_with((long long)x);}

int Decimal::compare_with(long long x) const {
	long long v = this->to_long_long();
	if (x == LLONG_MAX) return v != x ? -1 : this->to_string() != "9223372036854775807";
	if (x == LLONG_MIN) return v != x ? 1 : -(this->to_string() != "-9223372036854775808");
	return v < x ? -1 : v > x;
}

Decimal & Decimal::operator = (const string &s) {return this->initstr(s.c_str()), *this;}

Decimal & Decimal::operator = (const char *s) {return this->initstr(s), *this;}

Decimal & Decimal::operator = (int x) {
	this->init(), x < 0 && (is_neg = true, x = -x), s.back() = x % BASE;
	if (x >= BASE) s.push_back(x / BASE);
	return *this;
}

Decimal & Decimal::operator = (long long x) {
	this->init(), x < 0 && (is_neg = true, x = -x), s.back() = x % BASE;
	if (x >= BASE) s.push_back(x / BASE % BASE);
	if (x >= BASE2) s.push_back(x / BASE2);
	return *this;
}

Decimal & Decimal::operator = (const Decimal &b) {return is_neg = b.is_neg, s = b.s, *this;}

#define __DECIMAL_COMPARATOR__(op, neg) \
	bool operator op (const Decimal &a, const Decimal &b) {return a.compare_with(b) op 0;} \
	bool operator op (const Decimal &a, int x) {return a.compare_with(x) op 0;} \
	bool operator op (int x, const Decimal &b) {return b.compare_with(x) neg 0;} \
	bool operator op (const Decimal &a, long long x) {return a.compare_with(x) op 0;} \
	bool operator op (long long x, const Decimal &b) {return b.compare_with(x) neg 0;} 

__DECIMAL_COMPARATOR__(<, >);
__DECIMAL_COMPARATOR__(>, >);
__DECIMAL_COMPARATOR__(<=, >=);
__DECIMAL_COMPARATOR__(>=, <=);
__DECIMAL_COMPARATOR__(==, ==);
__DECIMAL_COMPARATOR__(!=, !=);
#undef __DECIMAL_COMPARATOR__

Decimal & Decimal::abs() {return is_neg = false, *this;}

Decimal & Decimal::neg() {return is_neg ^= !this->is_zero(), *this;}

Decimal operator - (const Decimal &a) {Decimal ret = a; return ret.neg();}

std::istream & operator >> (std::istream &in, Decimal &b) {string s; return in >> s, b.initstr(s.c_str()), in;}

std::ostream & operator << (std::ostream &out, const Decimal &b) {return out << b.to_string();}

void __builtin_abs_add_long_long(vector &s, long long x) {
	if (s.size() < 3u) s.resize(3);
	s[0] += x % Decimal::BASE, s[1] += x / Decimal::BASE % Decimal::BASE, s[2] += x / Decimal::BASE2;
	int i, n = (int)s.size(); s.push_back(0);
	for (i = 0; i < n; ++i) if (s[i] >= Decimal::BASE) s[i + 1] += s[i] / Decimal::BASE, s[i] %= Decimal::BASE;
}

void __builtin_abs_sub_long_long(vector &s, long long x) {
	if (s.size() < 3u) s.resize(3);
	s[0] -= x % Decimal::BASE, s[1] -= x / Decimal::BASE % Decimal::BASE, s[2] -= x / Decimal::BASE2;
	int i, n = (int)s.size(), d;
	for (i = 0; i < n - 1; ++i) if (s[i] < 0) s[i + 1] += d = (s[i] + 1) / Decimal::BASE - 1, s[i] -= d * Decimal::BASE;	
}

Decimal & Decimal::operator += (int x) {return *this += (long long)x;}

Decimal & Decimal::operator += (long long x) {
	if (!x) return *this;
	if (x == LLONG_MIN) return *this -= Decimal("9223372036854775808");
	if (x < 0) return *this -= -x;
	if (!is_neg)
		__builtin_abs_add_long_long(s, x);
	else
		switch (this->compare_with(-x)) {
			case -1 : __builtin_abs_sub_long_long(s, x); break;
			case 0 : return this->init(), *this;
			case 1 : return *this = Decimal(this->to_long_long() + x);
		}
	return this->canonicity();
}

Decimal & Decimal::operator -= (int x) {return *this -= (long long)x;}

Decimal & Decimal::operator -= (long long x) {
	if (!x) return *this;
	if (x == LLONG_MIN) return *this += Decimal("9223372036854775808");
	if (x < 0) return *this += -x;
	if (is_neg)
		__builtin_abs_add_long_long(s, x);
	else
		switch (this->compare_with(x)) {
			case -1 : return *this = Decimal(this->to_long_long() - x);
			case 0 : return this->init(), *this;
			case 1 : __builtin_abs_sub_long_long(s, x); break;
		}
	return this->canonicity();
}

Decimal & Decimal::operator *= (int x) {
	if (!x || this->is_zero()) return this->init(), *this;
	if (x < 0) is_neg ^= 1, x = -x;
	int i, n = s.size(); long long cur = 0;
	s.push_back(0), s.push_back(0);
	for (i = 0; i < n + 2; ++i) {
		cur = (long long)x * s[i] + cur;
		s[i] = cur % BASE, cur /= BASE;
	}
	return this->canonicity();
}

Decimal & Decimal::operator /= (int x) {
	if (this->is_zero()) return *this;
	bool neg = is_neg;
	if (x < 0) is_neg ^= 1, x = -x;
	int i, n = s.size(); long long cur = 0;
	for (i = n - 1; i >= 0; --i) {
		cur = cur * BASE + s[i];
		s[i] = cur / x, cur -= (long long)x * s[i];
	}
	if (neg && cur) __builtin_abs_add_long_long(s, 1ll);
	return this->canonicity();
}

Decimal & Decimal::operator %= (int x) {
	if (x < 0) x = -x;
	int i, n = s.size(); long long cur = 0;
	for (i = n - 1; i >= 0; --i) cur = (cur * BASE + s[i]) % x;
	if (this->is_neg) cur = (cur ? x - cur : 0);
	return *this = Decimal((int)cur);
}

Decimal operator + (const Decimal &a, int x) {Decimal ret = a; return ret += x;}
Decimal operator + (int x, const Decimal &a) {Decimal ret = a; return ret += x;}
Decimal operator + (const Decimal &a, long long x) {Decimal ret = a; return ret += x;}
Decimal operator + (long long x, const Decimal &a) {Decimal ret = a; return ret += x;}

Decimal operator - (const Decimal &a, int x) {Decimal ret = a; return ret -= x;}
Decimal operator - (int x, const Decimal &a) {return -(a - x);}
Decimal operator - (const Decimal &a, long long x) {Decimal ret = a; return ret -= x;}
Decimal operator - (long long x, const Decimal &a) {return -(a - x);}

Decimal operator * (const Decimal &a, int x) {Decimal ret = a; return ret *= x;}
Decimal operator * (int x, const Decimal &a) {Decimal ret = a; return ret *= x;}

Decimal operator / (const Decimal &a, int x) {Decimal ret = a; return ret /= x;}

Decimal operator % (const Decimal &a, int x) {Decimal ret = a; return ret %= x;}

Decimal operator + (const Decimal &a, const Decimal &b) {
	if (a.is_neg == b.is_neg) {
		int i, n = a.s.size(), m = b.s.size(), min, max;
		const Decimal &big = (n < m ? (min = n, max = m, b) : (min = m, max = n, a));
		Decimal ret; ret.is_neg = a.is_neg, ret.s.resize(max + 1);
		for (i = 0; i < min; ++i) {
			ret.s[i] += a.s[i] + b.s[i];
			if (ret.s[i] >= Decimal::BASE) ret.s[i] -= Decimal::BASE, ++ret.s[i + 1];
		}
		for (; i < max; ++i) {
			ret.s[i] += big.s[i];
			if (ret.s[i] >= Decimal::BASE) ret.s[i] -= Decimal::BASE, ++ret.s[i + 1];
		}
		return ret.canonicity();
	} else return a.is_neg ? b - -a : a - -b;
}

Decimal operator - (const Decimal &a, const Decimal &b) {
	if (!a.is_neg && !b.is_neg)
		switch (a.compare_with(b)) {
			case -1 : return -(b - a);
			case 0 : return Decimal();
			default : {
				int i, n = a.s.size(), m = b.s.size();
				Decimal ret = a;
				for (i = 0; i < n; ++i) {
					i < m ? ret.s[i] -= b.s[i] : 0;
					if (ret.s[i] < 0) ret.s[i] += Decimal::BASE, --ret.s[i + 1];
				}
				return ret.canonicity();
			}
		}
	else if (a.is_neg && b.is_neg) return -b - -a;
	else return a.is_neg ? -(-a + b) : a + -b;
}

Decimal operator * (const Decimal &a, const Decimal &b) {
	if (a.is_zero() || b.is_zero()) return Decimal();
	int i, j, k, n = a.s.size(), m = b.s.size(); long long cur = 0, carry = 0;
	Decimal ret; ret.is_neg = a.is_neg ^ b.is_neg, ret.s.resize(n + m);
	for (k = 0; k < n + m; ++k) {
		for (k < m ? (i = 0, j = k) : (i = k - m + 1, j = m - 1); i < n && j >= 0; ++i, --j)
			cur = (cur + (long long)a.s[i] * b.s[j]), carry += cur / Decimal::BASE, cur %= Decimal::BASE;
		ret.s[k] = (int)cur, cur = carry % Decimal::BASE, carry /= Decimal::BASE;
	}
	return ret.canonicity();
}

int __builtin_simple_division(const Decimal &a, const Decimal &b) {
	switch (a.compare_with(b)) {
		case -1 : return 0;
		case 0 : return 1;
	}
	int n = a.s.size(), m = b.s.size(), guess_quo; long long B;
	if (m == 1) return a.to_long_long() / b.s.back();
	B = (long long)b.s.back() * Decimal::BASE + b.s[m - 2];
	if (n == m + 1)
#ifdef _GLIBCXX_USE_INT128
		guess_quo = (((__int128)a.s.back() * Decimal::BASE + a.s[n - 2]) * Decimal::BASE + a.s[n - 3] + 1) / B;
#else
		guess_quo = (((long double)a.s.back() * Decimal::BASE + a.s[n - 2]) * Decimal::BASE + a.s[n - 3] + 1) / B, guess_quo += 2;
#endif
	else
		guess_quo = ((long long)a.s.back() * Decimal::BASE + a.s[n - 2] + 1) / B;
//	fprintf(stderr, "  ... Guess Quotient = %d\n", guess_quo);
	for (; a < b * guess_quo; --guess_quo);
//	fprintf(stderr, "  ... Final Quotient = %d\n", guess_quo);
	return guess_quo;
}

Decimal operator / (const Decimal &a, const Decimal &b) {
	if (a.is_zero() || b.is_zero()) return a;
	bool neg = a.is_neg;
	int i, n = a.s.size();
	Decimal cur, ret, B = b; ret.is_neg = a.is_neg ^ b.is_neg, ret.s.resize(n); B.abs();
	for (i = n - 1; i >= 0; --i) {
		cur = cur * Decimal::BASE + a.s[i];
		ret.s[i] = __builtin_simple_division(cur, B); cur -= B * ret.s[i];
	}
	if (neg && !cur.is_zero()) __builtin_abs_add_long_long(ret.s, 1ll);
	return ret.canonicity();
}

Decimal operator % (const Decimal &a, const Decimal &b) {return a - a / b * b;}

Decimal & Decimal::operator += (const Decimal &b) {return *this = *this + b;}

Decimal & Decimal::operator -= (const Decimal &b) {return *this = *this - b;}

Decimal & Decimal::operator *= (const Decimal &b) {return *this = *this * b;}

Decimal & Decimal::operator /= (const Decimal &b) {return *this = *this / b;}

Decimal & Decimal::operator %= (const Decimal &b) {return *this = *this % b;}

#endif
