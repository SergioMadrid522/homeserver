import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  lastname: string;
  email: string;
  createdAt: Date;
  role: string;
  storageLimit: number;
}

const bytesToGB = (bytes: number) => {
  return `${(bytes / 1024 ** 3).toFixed(0)} GB`;
};

export default function WelcomeEmail({
  name,
  lastname,
  email,
  createdAt,
  role,
  storageLimit,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Welcome to HomeServer 🚀</Preview>

      <Body
        style={{
          backgroundColor: '#f5f5f5',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '40px 0',
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Header */}

          <Section
            style={{
              backgroundColor: '#2563eb',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <Heading
              style={{
                color: '#ffffff',
                margin: 0,
                fontSize: '34px',
              }}
            >
              HomeServer
            </Heading>

            <Text
              style={{
                color: '#dbeafe',
                marginTop: '12px',
                fontSize: '16px',
              }}
            >
              Your personal cloud storage.
            </Text>
          </Section>

          {/* Content */}

          <Section
            style={{
              padding: '40px',
            }}
          >
            <Heading
              style={{
                marginTop: 0,
                color: '#111827',
              }}
            >
              Welcome, {name}! 👋
            </Heading>

            <Text
              style={{
                color: '#4b5563',
                lineHeight: '26px',
              }}
            >
              Your account has been successfully created.
              <br />
              HomeServer is now ready to securely store and organize your files.
            </Text>

            <Hr />

            <Heading
              as="h2"
              style={{
                fontSize: '20px',
                marginTop: '30px',
              }}
            >
              Account Information
            </Heading>

            <table
              style={{
                width: '100%',
                marginTop: '20px',
                borderCollapse: 'collapse',
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: '10px 0',
                      color: '#6b7280',
                    }}
                  >
                    Full Name
                  </td>

                  <td
                    style={{
                      textAlign: 'right',
                      fontWeight: '600',
                    }}
                  >
                    {name} {lastname}
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: '10px 0', color: '#6b7280' }}>Email</td>

                  <td style={{ textAlign: 'right' }}>{email}</td>
                </tr>

                <tr>
                  <td style={{ padding: '10px 0', color: '#6b7280' }}>Role</td>

                  <td style={{ textAlign: 'right' }}>{role}</td>
                </tr>

                <tr>
                  <td style={{ padding: '10px 0', color: '#6b7280' }}>
                    Storage
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {bytesToGB(storageLimit)}
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: '10px 0', color: '#6b7280' }}>
                    Created
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {createdAt.toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <Section
              style={{
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              <Button
                href="http://localhost:3000/login"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '14px 30px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Sign In
              </Button>
            </Section>

            <Hr
              style={{
                marginTop: '40px',
              }}
            />

            <Heading
              as="h3"
              style={{
                fontSize: '18px',
              }}
            >
              What's next?
            </Heading>

            <Text style={{ color: '#4b5563' }}>
              📁 Upload your first files.
            </Text>

            <Text style={{ color: '#4b5563' }}>
              📂 Organize everything into folders.
            </Text>

            <Text style={{ color: '#4b5563' }}>
              ⭐ Mark important files as favorites.
            </Text>

            <Text style={{ color: '#4b5563' }}>
              🗑️ Recover deleted files from the Trash.
            </Text>

            <Text
              style={{
                marginTop: '40px',
                color: '#9ca3af',
                fontSize: '14px',
              }}
            >
              If you didn't create this account, you can safely ignore this
              email.
            </Text>
          </Section>

          {/* Footer */}

          <Section
            style={{
              backgroundColor: '#fafafa',
              textAlign: 'center',
              padding: '24px',
            }}
          >
            <Text
              style={{
                color: '#9ca3af',
                fontSize: '13px',
                margin: 0,
              }}
            >
              © 2026 HomeServer. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
