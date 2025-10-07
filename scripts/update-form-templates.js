const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../data/section-templates/optin.json');

// Read the template file
const data = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

// Newsletter Signup template (optin-1)
const newsletterTemplate = data.templates.find(t => t.id === 'optin-1');
if (newsletterTemplate) {
  // Update section background
  newsletterTemplate.structure.props.root = {
    background: 'bg-palette:Primary'
  };
  newsletterTemplate.structure.props.mobile = {
    py: 'py-20'
  };

  // Update content container
  const contentContainer = newsletterTemplate.structure.children[0];
  contentContainer.props.root = {
    textAlign: 'text-center'
  };
  contentContainer.props.mobile = {
    maxWidth: 'style:contentWidth'
  };

  // Update title
  const title = contentContainer.children[0];
  title.props.root = {
    fontSize: 'text-3xl',
    color: 'text-palette:Primary Text',
    fontFamily: 'style:headingFontFamily'
  };
  title.props.mobile = {
    fontWeight: 'style:headingFont',
    mb: 'mb-4'
  };

  // Update description
  const description = contentContainer.children[1];
  description.props.root = {
    fontSize: 'text-lg',
    color: 'text-palette:Primary Text'
  };
  description.props.mobile = {
    mb: 'mb-8',
    opacity: 'opacity-90'
  };

  // Replace form container with Form component
  contentContainer.children[2] = {
    type: 'Form',
    props: {
      formType: 'subscribe',
      mobile: {
        display: 'flex',
        gap: 'gap-4',
        flexDirection: 'flex-col'
      },
      desktop: {
        flexDirection: 'flex-row'
      },
      custom: {
        displayName: 'Newsletter Form'
      }
    }
  };

  console.log('✅ Updated Newsletter Signup template');
}

// Contact Form template (optin-2)
const contactTemplate = data.templates.find(t => t.id === 'optin-2');
if (contactTemplate) {
  // Update section background
  contactTemplate.structure.props.root = {
    background: 'bg-palette:Alternate Background'
  };
  contactTemplate.structure.props.mobile = {
    py: 'py-24'
  };
  contactTemplate.structure.props.custom.displayName = 'Contact Form Section';

  // Update content container
  const contentContainer = contactTemplate.structure.children[0];
  contentContainer.props.mobile = {
    maxWidth: 'style:contentWidth'
  };

  // Update header container
  const headerContainer = contentContainer.children[0];
  headerContainer.props.root = {
    textAlign: 'text-center'
  };
  headerContainer.props.mobile = {
    mb: 'mb-12'
  };

  // Update title
  const title = headerContainer.children[0];
  title.props.root = {
    fontSize: 'text-4xl',
    fontFamily: 'style:headingFontFamily'
  };
  title.props.mobile = {
    fontWeight: 'style:headingFont',
    mb: 'mb-4'
  };

  // Update description
  const description = headerContainer.children[1];
  description.props.root = {
    fontSize: 'text-lg',
    color: 'text-palette:Alternate Text'
  };

  // Update form container
  const formContainer = contentContainer.children[1];
  formContainer.props.root = {
    background: 'bg-palette:Background',
    radius: 'style:borderRadius',
    shadow: 'style:shadowStyle'
  };
  formContainer.props.mobile = {
    p: 'style:containerPadding'
  };

  // Replace form fields with Form component
  formContainer.children = [
    {
      type: 'Form',
      props: {
        formType: 'contact',
        custom: {
          displayName: 'Contact Form'
        }
      }
    }
  ];

  console.log('✅ Updated Contact Form template');
}

// Write back to file
fs.writeFileSync(templatePath, JSON.stringify(data, null, 2));
console.log('✅ Successfully updated optin.json with Form components and design system properties');
