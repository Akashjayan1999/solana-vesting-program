import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import IDL from '../target/idl/vesting.json'
import { Vesting } from '../target/types/vesting'
import { BanksClient, ProgramTestContext } from 'solana-bankrun'
import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system'
import { createMint, mintTo } from 'spl-token-bankrun'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
describe('vesting smart contract test', () => {
  const companyName = "Company";
  let beneficiary: Keypair
  let context: ProgramTestContext
  let provider: BankrunProvider
  let program: Program<Vesting>
  let banksClient: BanksClient
  let employer: Keypair
  let mint: PublicKey
  let beneficiaryProvider: BankrunProvider
  let program2: Program<Vesting>
  let vestingAccountKey: PublicKey
  let treasuryTokenAccount: PublicKey;
  let employeeAccount: PublicKey;
  beforeAll(async () => {
    beneficiary = new anchor.web3.Keypair()
    context = await startAnchor(
      '',
      [{ name: 'vesting', programId: new PublicKey(IDL.address) }],
      [
        {
          address: beneficiary.publicKey,
          info: {
            lamports: 1_000_000_000,
            data: Buffer.alloc(0),
            owner: SYSTEM_PROGRAM_ID,
            executable: false,
          },
        },
      ],
    )
    provider = new BankrunProvider(context)
    program = new Program<Vesting>(IDL as Vesting, provider)

    banksClient = context.banksClient

    employer = provider.wallet.payer

    // Create a new mint
    // @ts-ignore
    mint = await createMint(banksClient, employer, employer.publicKey, null, 2)

    beneficiaryProvider = new BankrunProvider(context)
    beneficiaryProvider.wallet = new NodeWallet(beneficiary)

    program2 = new Program<Vesting>(IDL as Vesting, beneficiaryProvider);
    
    // Derive PDAs
    [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      program.programId
    );

    [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
      program.programId
    );

    [employeeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("employee_vesting"),
        beneficiary.publicKey.toBuffer(),
        vestingAccountKey.toBuffer(),
      ],
      program.programId
    );
    
  })

  it('is initialized!', () => {
    expect(true).toBe(true)
  })
})
