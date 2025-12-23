import { PrismaClient, Role, Genre, Categorie, SituationMatrimoniale, TypeVersement, TypeCotisation } from '@prisma/client'
import bcrypt from 'bcryptjs'

/**
 * Script de seed pour initialiser la base de données
 * Exécuter avec: npx prisma db seed
 */

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILISATEURS
  // ═══════════════════════════════════════════════════════════════════════════

  const passwordHash = await bcrypt.hash('password123', 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@eglise.com' },
    update: {},
    create: {
      name: 'Super Administrateur',
      email: 'admin@eglise.com',
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  })

  const tresorier = await prisma.user.upsert({
    where: { email: 'tresorier@eglise.com' },
    update: {},
    create: {
      name: 'Jean Trésorier',
      email: 'tresorier@eglise.com',
      password: passwordHash,
      role: Role.TRESORIER,
      isActive: true,
    },
  })

  const secretaire = await prisma.user.upsert({
    where: { email: 'secretaire@eglise.com' },
    update: {},
    create: {
      name: 'Marie Secrétaire',
      email: 'secretaire@eglise.com',
      password: passwordHash,
      role: Role.SECRETAIRE,
      isActive: true,
    },
  })

  console.log('✅ Utilisateurs créés:', { superAdmin: superAdmin.email, tresorier: tresorier.email, secretaire: secretaire.email })

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSOCIATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const associations = await Promise.all([
    prisma.association.upsert({
      where: { name: 'Chorale' },
      update: {},
      create: {
        name: 'Chorale',
        sigle: 'CHO',
        description: 'Groupe de chants et louanges',
      },
    }),
    prisma.association.upsert({
      where: { name: 'Jeunesse' },
      update: {},
      create: {
        name: 'Jeunesse',
        sigle: 'JEU',
        description: 'Mouvement des jeunes de l\'église',
      },
    }),
    prisma.association.upsert({
      where: { name: 'Femmes Chrétiennes' },
      update: {},
      create: {
        name: 'Femmes Chrétiennes',
        sigle: 'FEM',
        description: 'Association des femmes de l\'église',
      },
    }),
    prisma.association.upsert({
      where: { name: 'Hommes Chrétiens' },
      update: {},
      create: {
        name: 'Hommes Chrétiens',
        sigle: 'HOM',
        description: 'Association des hommes de l\'église',
      },
    }),
    prisma.association.upsert({
      where: { name: 'Enfants du Roi' },
      update: {},
      create: {
        name: 'Enfants du Roi',
        sigle: 'EDR',
        description: 'Ministère des enfants',
      },
    }),
  ])

  console.log('✅ Associations créées:', associations.length)

  // ═══════════════════════════════════════════════════════════════════════════
  // PAROISSIENS
  // ═══════════════════════════════════════════════════════════════════════════

  const paroissiens = await Promise.all([
    prisma.paroissien.upsert({
      where: { matricule: 'PAR-001' },
      update: {},
      create: {
        matricule: 'PAR-001',
        name: 'KOUAME Yao Jean',
        genre: Genre.HOMME,
        birthdate: new Date('1975-05-15'),
        birthplace: 'Abidjan',
        phone: '+225 07 00 00 01',
        email: 'kouame.jean@email.com',
        address: 'Cocody, Abidjan',
        categorie: Categorie.ANCIEN,
        situation: SituationMatrimoniale.MARIE,
        baptiseDate: new Date('1990-04-15'),
        confirmDate: new Date('1992-06-20'),
        adhesionDate: new Date('1988-01-01'),
      },
    }),
    prisma.paroissien.upsert({
      where: { matricule: 'PAR-002' },
      update: {},
      create: {
        matricule: 'PAR-002',
        name: 'KOFFI Adjoua Marie',
        genre: Genre.FEMME,
        birthdate: new Date('1980-08-22'),
        birthplace: 'Bouaké',
        phone: '+225 07 00 00 02',
        email: 'koffi.marie@email.com',
        address: 'Plateau, Abidjan',
        categorie: Categorie.DIACRE,
        situation: SituationMatrimoniale.MARIE,
        baptiseDate: new Date('1995-03-10'),
        adhesionDate: new Date('1993-06-15'),
      },
    }),
    prisma.paroissien.upsert({
      where: { matricule: 'PAR-003' },
      update: {},
      create: {
        matricule: 'PAR-003',
        name: 'BAMBA Moussa',
        genre: Genre.HOMME,
        birthdate: new Date('1990-12-01'),
        birthplace: 'Korhogo',
        phone: '+225 07 00 00 03',
        address: 'Yopougon, Abidjan',
        categorie: Categorie.FIDELE,
        situation: SituationMatrimoniale.CELIBATAIRE,
        baptiseDate: new Date('2015-07-20'),
        adhesionDate: new Date('2014-01-10'),
      },
    }),
    prisma.paroissien.upsert({
      where: { matricule: 'PAR-004' },
      update: {},
      create: {
        matricule: 'PAR-004',
        name: 'TRAORE Fatou',
        genre: Genre.FEMME,
        birthdate: new Date('1985-03-18'),
        birthplace: 'Man',
        phone: '+225 07 00 00 04',
        email: 'traore.fatou@email.com',
        address: 'Marcory, Abidjan',
        categorie: Categorie.FIDELE,
        situation: SituationMatrimoniale.VEUF,
        baptiseDate: new Date('2010-04-25'),
        adhesionDate: new Date('2008-09-01'),
      },
    }),
    prisma.paroissien.upsert({
      where: { matricule: 'PAR-005' },
      update: {},
      create: {
        matricule: 'PAR-005',
        name: 'DIALLO Ibrahim',
        genre: Genre.HOMME,
        birthdate: new Date('1995-07-30'),
        birthplace: 'Daloa',
        phone: '+225 07 00 00 05',
        address: 'Abobo, Abidjan',
        categorie: Categorie.FIDELE,
        situation: SituationMatrimoniale.CELIBATAIRE,
        adhesionDate: new Date('2020-02-14'),
      },
    }),
  ])

  console.log('✅ Paroissiens créés:', paroissiens.length)

  // ═══════════════════════════════════════════════════════════════════════════
  // AFFILIATIONS AUX ASSOCIATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const chorale = associations.find(a => a.sigle === 'CHO')!
  const jeunesse = associations.find(a => a.sigle === 'JEU')!
  const femmes = associations.find(a => a.sigle === 'FEM')!
  const hommes = associations.find(a => a.sigle === 'HOM')!

  await Promise.all([
    // KOUAME dans Hommes Chrétiens (principal) et Chorale
    prisma.associationParoissien.upsert({
      where: { paroissienId_associationId: { paroissienId: paroissiens[0].id, associationId: hommes.id } },
      update: {},
      create: {
        paroissienId: paroissiens[0].id,
        associationId: hommes.id,
        isPrimary: true,
        statut: 'Responsable',
      },
    }),
    prisma.associationParoissien.upsert({
      where: { paroissienId_associationId: { paroissienId: paroissiens[0].id, associationId: chorale.id } },
      update: {},
      create: {
        paroissienId: paroissiens[0].id,
        associationId: chorale.id,
        isPrimary: false,
        statut: 'Membre',
      },
    }),
    // KOFFI dans Femmes Chrétiennes
    prisma.associationParoissien.upsert({
      where: { paroissienId_associationId: { paroissienId: paroissiens[1].id, associationId: femmes.id } },
      update: {},
      create: {
        paroissienId: paroissiens[1].id,
        associationId: femmes.id,
        isPrimary: true,
        statut: 'Membre',
      },
    }),
    // BAMBA dans Jeunesse et Chorale
    prisma.associationParoissien.upsert({
      where: { paroissienId_associationId: { paroissienId: paroissiens[2].id, associationId: jeunesse.id } },
      update: {},
      create: {
        paroissienId: paroissiens[2].id,
        associationId: jeunesse.id,
        isPrimary: true,
        statut: 'Membre',
      },
    }),
    prisma.associationParoissien.upsert({
      where: { paroissienId_associationId: { paroissienId: paroissiens[2].id, associationId: chorale.id } },
      update: {},
      create: {
        paroissienId: paroissiens[2].id,
        associationId: chorale.id,
        isPrimary: false,
        statut: 'Membre',
      },
    }),
  ])

  console.log('✅ Affiliations créées')

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGAGEMENTS (Année 2024)
  // ═══════════════════════════════════════════════════════════════════════════

  const engagements = await Promise.all(
    paroissiens.map(p =>
      prisma.engagement.create({
        data: {
          paroissienId: p.id,
          dime: 120000, // 10 000 FCFA/mois
          cotisation: 24000, // 2 000 FCFA/mois
          detteDime: 0,
          detteCotisation: 0,
          availableDime: Math.floor(Math.random() * 120000),
          availableCotisation: Math.floor(Math.random() * 24000),
          availableDetteDime: 0,
          availableDetteCotisation: 0,
          periodeStart: new Date('2024-01-01'),
          periodeEnd: new Date('2024-12-31'),
        },
      })
    )
  )

  console.log('✅ Engagements créés:', engagements.length)

  // ═══════════════════════════════════════════════════════════════════════════
  // VERSEMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  const versements = await Promise.all([
    prisma.versement.create({
      data: {
        paroissienId: paroissiens[0].id,
        engagementId: engagements[0].id,
        type: TypeVersement.DIME,
        somme: 30000,
        dateVersement: new Date('2024-03-15'),
        reference: 'VER-2024-001',
      },
    }),
    prisma.versement.create({
      data: {
        paroissienId: paroissiens[0].id,
        engagementId: engagements[0].id,
        type: TypeVersement.DIME,
        somme: 30000,
        dateVersement: new Date('2024-06-20'),
        reference: 'VER-2024-002',
      },
    }),
    prisma.versement.create({
      data: {
        paroissienId: paroissiens[1].id,
        engagementId: engagements[1].id,
        type: TypeVersement.DIME,
        somme: 25000,
        dateVersement: new Date('2024-04-10'),
        reference: 'VER-2024-003',
      },
    }),
    prisma.versement.create({
      data: {
        paroissienId: paroissiens[2].id,
        engagementId: engagements[2].id,
        type: TypeVersement.OFFRANDE_CONSTRUCTION,
        somme: 50000,
        dateVersement: new Date('2024-05-01'),
        reference: 'VER-2024-004',
      },
    }),
  ])

  console.log('✅ Versements créés:', versements.length)

  // ═══════════════════════════════════════════════════════════════════════════
  // COTISATIONS SPÉCIALES
  // ═══════════════════════════════════════════════════════════════════════════

  const cotisations = await Promise.all([
    prisma.cotisation.create({
      data: {
        paroissienId: paroissiens[0].id,
        type: TypeCotisation.RECOLTE,
        somme: 15000,
        forYear: 2024,
        description: 'Cotisation récolte annuelle',
      },
    }),
    prisma.cotisation.create({
      data: {
        paroissienId: paroissiens[1].id,
        type: TypeCotisation.RECOLTE,
        somme: 12000,
        forYear: 2024,
        description: 'Cotisation récolte annuelle',
      },
    }),
  ])

  console.log('✅ Cotisations créées:', cotisations.length)

  // ═══════════════════════════════════════════════════════════════════════════
  // OFFRANDES DES ASSOCIATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const offrandes = await Promise.all([
    prisma.offrande.create({
      data: {
        associationId: chorale.id,
        somme: 25000,
        offrandeDay: new Date('2024-03-03'),
        description: 'Offrande du dimanche',
      },
    }),
    prisma.offrande.create({
      data: {
        associationId: jeunesse.id,
        somme: 18000,
        offrandeDay: new Date('2024-03-10'),
        description: 'Offrande du dimanche',
      },
    }),
    prisma.offrande.create({
      data: {
        associationId: femmes.id,
        somme: 35000,
        offrandeDay: new Date('2024-03-17'),
        description: 'Offrande spéciale journée de la femme',
      },
    }),
  ])

  console.log('✅ Offrandes créées:', offrandes.length)

  console.log('🎉 Seeding terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
