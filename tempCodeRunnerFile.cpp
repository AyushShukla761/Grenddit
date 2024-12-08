#include <bits/stdc++.h>
using namespace std;
#define ll long long int
int ans=0;


void f(ll i, ll j){
    if(i>=j) return;
    f(i+1,j);
    f(i,j-1);
    ans++;
}

int main() {
    // Write C++ code here
    f(1,100);
    // cout<<pow(2,100);
    return 0;
}