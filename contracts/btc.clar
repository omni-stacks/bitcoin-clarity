(define-constant CONTRACT_OWNER tx-sender)
(define-constant CONTRACT_ADDRESS (as-contract tx-sender))
(define-constant DEPLOYED_AT block-height)

(define-constant ERR_INVALID_TX (err u1000))
(define-constant ERR_INVALID_BASE (err u1001))
(define-constant ERR_OUT_OF_BOUNDS (err u1002))

(define-read-only (buff-to-u8 (byte (buff 1)))
  (unwrap-panic (index-of 0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff byte))
)

(define-read-only (parse-tx (tx (buff 1024)))
  (begin
    (asserts! (> (len tx) u0) ERR_INVALID_TX)
    (ok true)
  )
)

(define-read-only (read-uint (data (buff 1024)) (offset uint) (base int))
  (let
    (
      (shift (pow u2 (+ u1 (unwrap! (index-of (list 16 32 64) base) ERR_INVALID_BASE))))
    )
    (ok {
      offset: (+ offset shift),
      val:
        (+
          (buff-to-u8 (unwrap! (element-at data offset) ERR_OUT_OF_BOUNDS))
          (* (buff-to-u8 (unwrap! (element-at data (+ offset u1)) ERR_OUT_OF_BOUNDS)) u256)
          (if (> base 16)
            (+
              (* (buff-to-u8 (unwrap! (element-at data (+ offset u2)) ERR_OUT_OF_BOUNDS)) u65536)
              (* (buff-to-u8 (unwrap! (element-at data (+ offset u3)) ERR_OUT_OF_BOUNDS)) u16777216)
              (if (> base 32)
                (+
                  (* (buff-to-u8 (unwrap! (element-at data (+ offset u4)) ERR_OUT_OF_BOUNDS)) u4294967296)
                  (* (buff-to-u8 (unwrap! (element-at data (+ offset u5)) ERR_OUT_OF_BOUNDS)) u1099511627776)
                  (* (buff-to-u8 (unwrap! (element-at data (+ offset u6)) ERR_OUT_OF_BOUNDS)) u281474976710656)
                  (* (buff-to-u8 (unwrap! (element-at data (+ offset u7)) ERR_OUT_OF_BOUNDS)) u72057594037927936)
                )
                u0
              )
            )
            u0
          )
        )
    })
  )
)
