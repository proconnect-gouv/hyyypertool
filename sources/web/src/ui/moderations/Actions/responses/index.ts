//

import * as admin_centrale from "./admin_centrale";
import * as agent_comcom_comaglo from "./agent_comcom_comaglo";
import * as agent_comcom_to_commune from "./agent_comcom_to_commune";
import * as agent_outside_min_finance_chorus_pro from "./agent_outside_min_finance_chorus_pro";
import * as association_ordinary_person from "./association_ordinary_person";
import * as association_with_staff_but_no_domain_name from "./association_with_staff_but_no_domain_name";
import * as contractors from "./contractors";
import * as domain_name_not_found from "./domain_name_not_found";
import * as enseignement_agricole from "./enseignement_agricole";
import * as existing_domain_name from "./existing_domain_name";
import * as first_and_last_name_inversion from "./first_and_last_name_inversion";
import * as gendarmerie_agent from "./gendarmerie_agent";
import * as link_with_chosen_organization from "./link_with_chosen_organization";
import * as min_armees from "./min_armees";
import * as min_armees_pec from "./min_armees_pec";
import * as min_armees_terre_marine_musee from "./min_armees_terre_marine_musee";
import * as missing_name from "./missing_name";
import * as more_precise_existing_establishement_cnrs from "./more_precise_existing_establishement_cnrs";
import * as name_incorrectly_entered from "./name_incorrectly_entered";
import * as non_teaching_agent from "./non_teaching_agent";
import * as presta_email_admin_public from "./presta_email_admin_public";
import * as presta_email_orga_public_beta_gouv from "./presta_email_orga_public_beta_gouv";
import * as public_or_private_organization from "./public_or_private_organization";
import * as refusal_france_travail from "./refusal_france_travail";
import * as refusal_interieur_gouv from "./refusal_interieur_gouv";
import * as reservist_or_other_email_perso from "./reservist_or_other_email_perso";
import * as seconded_agent_min_interior from "./seconded_agent_min_interior";
import * as student_host_organisation from "./student_host_organisation";
import * as student_school_training_establishment from "./student_school_training_establishment";
import * as teacher_academic_email from "./teacher_academic_email";
import * as university_email_cnrs from "./university_email_cnrs";
import * as use_official_email from "./use_official_email";
import * as user_with_existing_pc_account from "./user_with_existing_pc_account";

//

export const reponse_templates = [
  use_official_email,
  contractors,
  refusal_interieur_gouv,
  enseignement_agricole,
  missing_name,
  first_and_last_name_inversion,
  name_incorrectly_entered,
  min_armees,
  admin_centrale,
  teacher_academic_email,
  link_with_chosen_organization,
  public_or_private_organization,
  min_armees_pec,
  non_teaching_agent,
  refusal_france_travail,
  min_armees_terre_marine_musee,
  gendarmerie_agent,
  university_email_cnrs,
  user_with_existing_pc_account,
  existing_domain_name,
  more_precise_existing_establishement_cnrs,
  association_with_staff_but_no_domain_name,
  association_ordinary_person,
  presta_email_admin_public,
  agent_outside_min_finance_chorus_pro,
  student_school_training_establishment,
  student_host_organisation,
  seconded_agent_min_interior,
  presta_email_orga_public_beta_gouv,
  reservist_or_other_email_perso,
  agent_comcom_comaglo,
  agent_comcom_to_commune,
  domain_name_not_found,
];
