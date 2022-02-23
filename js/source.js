let wordleSrc = `
let list $in
len $list total
rnd idx 0 $total

get $list $idx w

let map {}
for c $w
 put $map $c 1
nxt

let count 0

#loop
inp in

let res []
let win 1
for i 5
 get $in $i input_c
 get $w $i true_c
 ife $input_c $true_c
  psh $res 1
 els
  get $map $input_c contains
  ife $contains $nil
   psh $res 0
   let win 0
  els
   psh $res 2
   let win 0
  fin
 fin
nxt

/ prt $w
prt $res

ife $win 1
 prt 'win:'
els
 ife $count 5
  let fail_res 'fail:'
  add fail_res $fail_res $w
  prt $fail_res
  jmp end
 fin
 add count $count 1
 jmp loop
fin
#end
`
